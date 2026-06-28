import { apiKey } from "@better-auth/api-key";
import { setUserLastActiveOrg } from "@repo/db";
import { db } from "@repo/db/db";
import * as schema from "@repo/db/schema";
import { sendInvitationEmail, sendMagicLink, sendWelcomeEmail } from "@repo/email";
import { env } from "@repo/env";
import { logger } from "@repo/shared";
import { generateId, ID_PREFIXES } from "@repo/shared/id";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, organization, testUtils } from "better-auth/plugins";
import { getDefaultOrgOrCreate } from "./handlers/session";
import { ac, roles } from "./permissions";

const enableTestUtils = process.env.ENABLE_TEST_UTILS === "1";

export const auth = betterAuth({
  baseURL: env.API_BASE_URL,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),

  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await sendWelcomeEmail(user.email);
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          logger.debug(`Creating session for user ${session.userId}`);
          const organizationId = await getDefaultOrgOrCreate(session.userId);
          if (!organizationId) {
            throw new Error("Organization not found");
          }
          logger.debug(`Setting activeOrganizationId to ${organizationId} for user ${session.userId}`);
          return {
            data: {
              ...session,
              activeOrganizationId: organizationId,
            },
          };
        },
      },
      update: {
        before: async (data, ctx) => {
          // Mirror an active-org switch onto the user record so it can be
          // restored on future sessions. Skips the many session updates that
          // don't touch activeOrganizationId (refresh, expiry extension, ...).
          const organizationId = data?.activeOrganizationId;
          // ctx.context.session is the { session, user } pair; the user id
          // lives on the session row.
          const userId = (ctx?.context?.session as { session?: { userId?: string } } | null | undefined)?.session
            ?.userId;
          if (userId && typeof organizationId === "string") {
            await setUserLastActiveOrg({ userId, organizationId });
          }
          return { data };
        },
      },
    },
    account: {
      create: {
        before: async (account) => {
          return {
            data: {
              ...account,
              id: generateId(ID_PREFIXES.account),
            },
          };
        },
      },
    },
    verification: {
      create: {
        before: async (verification) => {
          return {
            data: {
              ...verification,
              id: generateId(ID_PREFIXES.verification),
            },
          };
        },
      },
    },
  },
  plugins: [
    apiKey({
      references: "organization",
      rateLimit: {
        enabled: true,
        timeWindow: 60000,
        maxRequests: 100,
      },
    }),
    organization({
      ac,
      roles,
      sendInvitationEmail: (data) => {
        return sendInvitationEmail({
          email: data.email,
          role: data.role,
          id: data.id,
          organizationName: data.organization.name,
          inviter: data.inviter.user.name,
        });
      },
      cancelPendingInvitationsOnReInvite: true,
      organizationHooks: {
        afterAcceptInvitation: async ({ invitation, member: newMember }) => {
          // The accepting user's active org + preference are set via the
          // `set-active` call in the invitation handler (email link) or the
          // client (in-app), which triggers the `session.update` mirror hook.
          logger.info(
            { organizationId: invitation.organizationId, userId: newMember.userId, memberId: newMember.id },
            "Member accepted invitation",
          );
        },
      },
    }),
    magicLink({
      sendMagicLink: sendMagicLink,
    }),
    // Test helpers (createUser/login/getAuthHeaders) — only when explicitly
    // enabled. Never active in production (ENABLE_TEST_UTILS is unset).
    ...(enableTestUtils ? [testUtils({ captureOTP: true })] : []),
  ],
  socialProviders: {
    google: {
      prompt: "select_account",
      enabled: env.GOOGLE_CLIENT_ID !== undefined && env.GOOGLE_CLIENT_SECRET !== undefined,
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
    },
    microsoft: {
      enabled: env.MICROSOFT_CLIENT_ID !== undefined && env.MICROSOFT_CLIENT_SECRET !== undefined,
      clientSecret: env.MICROSOFT_CLIENT_SECRET || "",
      clientId: env.MICROSOFT_CLIENT_ID || "",
    },
  },
  trustedOrigins: [env.DASHBOARD_BASE_URL],
});
