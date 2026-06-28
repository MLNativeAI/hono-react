import { render } from "@react-email/render";
import { env } from "@repo/env";
import { logger } from "@repo/shared";
import { Resend } from "resend";
import { emailConfig } from "./email-config";
import InvitationEmail from "./emails/invitation";
import { MagicLinkEmail } from "./emails/magic-link";
import WelcomeEmail from "./emails/welcome";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

type Attachement = {
  filename: string;
  content: Buffer;
};
export async function sendInvitationEmail({
  email,
  role,
  id,
  inviter,
  organizationName,
}: {
  id: string;
  role: string;
  email: string;
  inviter: string;
  organizationName: string;
}): Promise<void> {
  if (!resend) {
    logger.info(`Invitation link for ${email}: ${env.API_BASE_URL}/api/internal/accept-invitation?invitationId=${id}`);
    return;
  }

  const url = `${env.API_BASE_URL}/api/internal/accept-invitation?invitationId=${id}`;
  logger.info({ email, url }, `Sending invitation link to ${email}: ${url}`);
  const emailHtml = await render(
    InvitationEmail({
      url,
      inviter,
      organizationName,
      role,
    }),
  );

  await sendEmailHandler({
    to: email,
    subject: `You've been invited to join ${organizationName} on ${emailConfig.serviceName}`,
    html: emailHtml,
  });
}

export async function sendWelcomeEmail(email: string) {
  const emailHtml = await render(WelcomeEmail());
  await sendEmailHandler({
    to: [email],
    subject: "Welcome to Hono-React!",
    html: emailHtml,
    replyTo: "contact@mlnative.com",
  });
}

export async function sendMagicLink({ email, url }: { email: string; url: string }) {
  if (!resend) {
    logger.info(`Magic link for ${email}: ${url}`);
    return;
  }

  logger.info({ email, url }, `Sending magic link to ${email}: ${url}`);
  const emailHtml = await render(MagicLinkEmail({ url }));

  await sendEmailHandler({
    to: email,
    subject: "Sign in to Hono-React",
    html: emailHtml,
  });
}

async function sendEmailHandler({
  to,
  subject,
  html,
  replyTo,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachement[];
}) {
  if (!resend) {
    logger.info(`Resend is disabled, not sending email`);
    return;
  }

  try {
    await resend.emails.send({
      from: emailConfig.fromEmail,
      to,
      subject,
      replyTo: replyTo,
      html,
      attachments,
    });
  } catch (error) {
    logger.error(error, "Failed to send email");
    throw error;
  }
}
