import { db } from "@repo/db/db";
import * as schema from "@repo/db/schema";
import {
  scheduleFeedbackEmail,
  sendInvitationEmail,
  sendMagicLink,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "@repo/engine";
import { envVars, logger } from "@repo/shared";
import { generateId, ID_PREFIXES } from "@repo/shared/id";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, apiKey, magicLink, organization } from "better-auth/plugins";
import { getDefaultOrgOrCreate } from "./handlers/session";

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: sendPasswordResetEmail,
    onPasswordReset: async ({ user }, _) => {
      logger.info(`Password for user ${user.email} has been reset.`);
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
      onboardingCompleted: {
        type: "boolean",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await sendWelcomeEmail(user.email);
          await scheduleFeedbackEmail(user.email);
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          logger.info(`Creating session for user ${session.userId}`);
          const organizationId = await getDefaultOrgOrCreate(session.userId);
          if (!organizationId) {
            throw new Error("Organization not found");
          }
          logger.info(`Setting activeOrganizationId to ${organizationId} for user ${session.userId}`);
          return {
            data: {
              ...session,
              activeOrganizationId: organizationId,
            },
          };
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
    admin({
      adminRoles: ["superadmin"],
    }),
    apiKey({
      rateLimit: {
        enabled: true,
        timeWindow: 60000,
        maxRequests: 100,
      },
    }),
    organization({
      sendInvitationEmail: sendInvitationEmail,
      cancelPendingInvitationsOnReInvite: true,
      organizationHooks: {
        afterCreateOrganization: async ({ organization, member, user }) => {
          logger.info(`Organization ${organization.id} created for user ${user.id}`);
          logger.info(`Member ${member.id} created with role ${member.role}`);
        },
      },
    }),
    magicLink({
      sendMagicLink: sendMagicLink,
    }),
  ],
  socialProviders: {
    google: {
      prompt: "select_account",
      enabled: envVars.GOOGLE_CLIENT_ID !== undefined && envVars.GOOGLE_CLIENT_SECRET !== undefined,
      clientId: envVars.GOOGLE_CLIENT_ID || "",
      clientSecret: envVars.GOOGLE_CLIENT_SECRET || "",
    },
    microsoft: {
      enabled: envVars.MICROSOFT_CLIENT_ID !== undefined && envVars.MICROSOFT_CLIENT_SECRET !== undefined,
      clientSecret: envVars.MICROSOFT_CLIENT_SECRET || "",
      clientId: envVars.MICROSOFT_CLIENT_ID || "",
    },
  },
  trustedOrigins: [envVars.BASE_URL],
});

