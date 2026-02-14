import { render } from "@react-email/render";
import { logger } from "@repo/shared";
import { envVars } from "@repo/shared/env";
import { Resend } from "resend";
import { emailConfig } from "./email-config";
import FeedbackEmail from "./emails/feedback";
import InvitationEmail from "./emails/invitation";
import { MagicLinkEmail } from "./emails/magic-link";
import WelcomeEmail from "./emails/welcome";

const resend = envVars.RESEND_API_KEY ? new Resend(envVars.RESEND_API_KEY) : null;

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
    logger.info(`Invitation link for ${email}: ${envVars.API_BASE_URL}/accept-invitation/${id}`);
    return;
  }

  const url = `${envVars.API_BASE_URL}/api/internal/accept-invitation?invitationId=${id}`;
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

export async function sendFeedbackEmail(email: string) {
  const emailHtml = await render(FeedbackEmail());
  await sendEmailHandler({
    to: [email],
    subject: "How's your Hono-React experience so far?",
    html: emailHtml,
    replyTo: "lukasz@mlnative.com",
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
      reply_to: replyTo,
      html,
      attachments,
    });
  } catch (error) {
    logger.error(error, "Failed to send email");
    throw error;
  }
}
