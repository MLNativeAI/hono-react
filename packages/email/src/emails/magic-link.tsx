import { Text } from "@react-email/components";
import { ActionButton, EmailHeading, EmailLayout, FooterSection, LogoSection } from "./shared-components";
import { emailConfig } from "../email-config";

export interface MagicLinkEmailProps {
  url: string;
  token?: string;
}

export const MagicLinkEmail = ({ url }: MagicLinkEmailProps) => {
  const previewText = `Sign in to ${emailConfig.serviceName}`;

  return (
    <EmailLayout previewText={previewText}>
      <LogoSection />
      <EmailHeading>
        Sign in to <strong>{emailConfig.serviceName}</strong>
      </EmailHeading>
      <Text className="text-black text-[14px] leading-[24px]">
        Click the button below to sign in to your {emailConfig.serviceName} account. This link will expire in 10 minutes.
      </Text>
      <ActionButton href={url}>Sign in to {emailConfig.serviceName}</ActionButton>
      <Text className="text-[#666666] text-[12px] leading-[24px]">
        If the button doesn't work, copy and paste this link into your browser:
      </Text>
      <Text className="text-[#666666] text-[12px] leading-[24px] break-all">{url}</Text>
      <Text className="text-black text-[14px] leading-[24px]">
        If you didn't request this email, you can safely ignore it.
      </Text>
      <FooterSection />
    </EmailLayout>
  );
};
