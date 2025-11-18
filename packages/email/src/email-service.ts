import { envVars, logger } from "@repo/shared";
import { Resend } from "resend";
import { getApiBaseUrl } from "./util";
import { render } from "@react-email/render";
import InvitationEmail from "./emails/invitation";
import { emailConfig } from "./email-config";
import ResetPasswordEmailTemplate from "./emails/password-reset";

const resend = envVars.RESEND_API_KEY ? new Resend(envVars.RESEND_API_KEY) : null;

export async function sendInvitationEmail({ email, inviterName, organizationName, role, invitationId }: { email: string; inviterName: string; organizationName: string; role: string; invitationId: string; }): Promise<void> {
  if (!resend) {
    logger.info(`Invitation link for ${email}: ${envVars.BASE_URL}/accept-invitation/${invitationId}`);
    return;
  }

  const url = `${getApiBaseUrl()}/api/internal/accept-invitation?invitationId=${invitationId}`;
  logger.info({ email, url }, `Sending invitation link to ${email}: ${url}`);
  const emailHtml = await render(
    InvitationEmail({
      url,
      inviterName,
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
    logger.info(`Resend is disabled, not sending email to ${Array.isArray(to) ? to[0] : to}`);
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
