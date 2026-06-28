import { describe, expect, test } from "bun:test";
import { adminRole, memberRole, ownerRole, type Resource } from "./permissions";

const roleMap = { owner: ownerRole, admin: adminRole, member: memberRole } as const;

/**
 * Single source of truth for the RBAC expectations. If this matrix changes,
 * `permissions.ts` and the route-level requirePermission calls must change
 * together — the integration tests guard the route wiring.
 */
const EXPECTED: Record<keyof typeof roleMap, Partial<Record<Resource, string[]>>> = {
  owner: {
    project: ["create", "read", "update", "delete"],
    apiKey: ["create", "read", "update", "delete"],
  },
  admin: {
    // Deleting a project is an owner-only escalation.
    project: ["create", "read", "update"],
    apiKey: ["create", "read", "update", "delete"],
  },
  member: {
    project: ["read"],
    apiKey: ["read"],
  },
};

const ALL_ACTIONS: Record<Resource, string[]> = {
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
  ac: ["create", "read", "update", "delete"],
  apiKey: ["create", "read", "update", "delete"],
  project: ["create", "read", "update", "delete"],
};

describe("access control matrix", () => {
  (Object.keys(roleMap) as (keyof typeof roleMap)[]).forEach((roleName) => {
    describe(`${roleName} role`, () => {
      (["project", "apiKey"] as const).forEach((resource) => {
        for (const action of ALL_ACTIONS[resource]) {
          const allowed = EXPECTED[roleName][resource]?.includes(action) ?? false;
          test(`${allowed ? "can" : "cannot"} ${action} ${resource}`, () => {
            const result = roleMap[roleName].authorize({ [resource]: [action] } as never);
            expect(result.success).toBe(allowed);
          });
        }
      });
    });
  });
});
