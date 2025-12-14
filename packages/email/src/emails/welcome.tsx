import { Text } from "@react-email/components";
import { emailConfig } from "../email-config";
import { ActionButton, EmailHeading, EmailLayout, FooterSection, LogoSection } from "./shared-components";

export const WelcomeEmail = () => {
  const previewText = "Welcome to Hono-React - service tagLine";

  return (
    <EmailLayout previewText={previewText}>
      <LogoSection />

      <EmailHeading>Welcome to {emailConfig.serviceName}!</EmailHeading>

      <Text className="text-black text-[14px] leading-[24px]">Hi there!</Text>

      <Text className="text-black text-[14px] leading-[24px]">
        Welcome message here
      </Text>

      <Text className="text-black text-[14px] leading-[24px]">
        A tagline here
      </Text>

      <ActionButton href={emailConfig.appUrl}>Go to your Dashboard</ActionButton>

      <Text className="text-[#666666] text-[12px] leading-[24px]">
        P.S. Need any help getting started? Just reply to this email - I personally read every message and I'm happy to
        help!
      </Text>

      <Text className="text-black text-[14px] leading-[24px]">
        Best regards, <br />
        {emailConfig.emailPerson}
      </Text>

      <FooterSection />
    </EmailLayout>
  );
};

export default WelcomeEmail;
