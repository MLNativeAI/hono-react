export type AuthContext = {
  userId: string;
  organizationId: string;
  scope: "user" | "superadmin";
};
