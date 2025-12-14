import { render } from "@react-email/render";
import { envVars, logger } from "@repo/shared";
import { Resend } from "resend";
import { emailConfig } from "./email-config";
import InvitationEmail from "./emails/invitation";
import ResetPasswordEmailTemplate from "./emails/password-reset";
import { getApiBaseUrl } from "./util";

const resend = envVars.RESEND_API_KEY ? new Resend(envVars.RESEND_API_KEY) : null;

export async function sendInvitationEmail({
  email,
  inviter,
  organizationName,
  role,
  invitationId,
}: {
  email: string;
  inviter: string;
  organizationName: string;
  role: string;
  invitationId: string;
}): Promise<void> {
  const url = `${getApiBaseUrl()}/api/internal/accept-invitation?invitationId=${invitationId}`;
  if (!resend) {
    logger.warn({ email, url }, `Resend not configured, not sending link`);
    return;
  }

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

export async function sendPasswordResetEmail(targetEmail: string, targetUsername: string, resetUrl: string) {
  if (!resend) {
    logger.warn(`Resend not configured, password reset link:  ${targetEmail}: ${resetUrl}`);
    return;
  }

  logger.info(`Sending password reset link to ${targetEmail}: ${resetUrl}`);

  const emailHtml = await render(ResetPasswordEmailTemplate({ resetUrl: resetUrl, username: targetUsername }));

  await sendEmailHandler({
    to: targetEmail,
    subject: "Password reset",
    html: emailHtml,
  });
}

async function sendEmailHandler({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
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
    });
  } catch (error) {
    logger.error(error, "Failed to send email");
    throw error;
  }
}
