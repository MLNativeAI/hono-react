export type AuthContext = {
	userId: string;
  organizationId: string;
  activePlan: SubscriptionPlan
  scope: "user" | "superadmin";
};

export type SubscriptionPlan = 'free' | 'basic' | 'pro'
