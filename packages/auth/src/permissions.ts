import { createAccessControl } from "better-auth/plugins/access";

/**
 * Access control statements.
 *
 * The organization/member/invitation/team/ac entries mirror BetterAuth's
 * built-in defaults so the organization plugin's own endpoints keep working.
 * `apiKey` and `project` are application-specific resources.
 */
export const statements = {
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
  ac: ["create", "read", "update", "delete"],
  apiKey: ["create", "read", "update", "delete"],
  project: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statements);

export const ownerRole = ac.newRole({
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
  ac: ["create", "read", "update", "delete"],
  apiKey: ["create", "read", "update", "delete"],
  project: ["create", "read", "update", "delete"],
});

export const adminRole = ac.newRole({
  organization: ["update"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
  ac: ["create", "read", "update", "delete"],
  apiKey: ["create", "read", "update", "delete"],
  // Deleting a project is an owner-only escalation; admins manage day-to-day.
  project: ["create", "read", "update"],
});

export const memberRole = ac.newRole({
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: ["read"],
  apiKey: ["read"],
  project: ["read"],
});

export const roles = {
  owner: ownerRole,
  admin: adminRole,
  member: memberRole,
} as const;

export type OrgRole = keyof typeof roles;
export type Resource = keyof typeof statements;
export type Action<T extends Resource = Resource> = (typeof statements)[T][number];
