import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { emailConfig } from "../email-config";

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText: string;
}

export const EmailLayout = ({ children, previewText }: EmailLayoutProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans px-2">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
          {children}
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const LogoSection = () => (
  <Section className="mt-[32px]">
    <a href={emailConfig.landingUrl} target="_blank" rel="noopener">
      <Img
        width={100}
        height="auto"
        src={emailConfig.logo}
        alt={`${emailConfig.serviceName} logo`}
        className="my-0 mx-auto"
      />
    </a>
  </Section>
);

interface EmailHeadingProps {
  children: React.ReactNode;
}

export const EmailHeading = ({ children }: EmailHeadingProps) => (
  <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">{children}</Heading>
);

interface ActionButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const ActionButton = ({
  href,
  children,
  className = "bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3",
}: ActionButtonProps) => (
  <Section className="text-center mt-[32px] mb-[32px] items-center flex ">
    <Button className={className} href={href}>
      {children}
    </Button>
  </Section>
);

export const FooterSection = () => (
  <>
    <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
    <div className="flex justify-between w-full items-center gap-4">
      <div className="flex flex-col gap-2">
        <div className="text-md">{emailConfig.serviceName}</div>
        <div className="text-sm text-[#999999]">{emailConfig.tagLine}</div>
      </div>
      <a href={emailConfig.landingUrl} target="_blank" rel="noopener">
        <Img width={40} height={40} src={emailConfig.icon} alt={`${emailConfig.serviceName} logo`} className="" />
      </a>
    </div>
    <Section className="mt-[12px]">
      <Text className="text-[#999999] text-[8px] leading-[16px]">
        {emailConfig.companyAddress.map((line, index) => (
          <span key={index}>
            {line}
            {index < emailConfig.companyAddress.length - 1 && <br />}
          </span>
        ))}
      </Text>
    </Section>
  </>
);
