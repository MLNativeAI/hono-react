import { expect, test } from "bun:test";
import { Avatar } from "@repo/ui/components/avatar";
import { render } from "@testing-library/react";
import type { Organization } from "better-auth/plugins";
import OrgLogoWithFallback from "./org-logo-with-fallback";

const organization = (overrides: Partial<Organization> = {}): Organization =>
  ({ id: "org_1", name: "Example Company", slug: "example", createdAt: new Date(), ...overrides }) as Organization;

test("renders organization initials when no logo exists", () => {
  const view = render(
    <Avatar>
      <OrgLogoWithFallback activeOrganization={organization()} />
    </Avatar>,
  );
  expect(view.getByText("EC")).toBeTruthy();
});

test("uses a safe fallback for an empty organization name", () => {
  const view = render(
    <Avatar>
      <OrgLogoWithFallback activeOrganization={organization({ name: "" })} />
    </Avatar>,
  );
  expect(view.getByText("U")).toBeTruthy();
});
