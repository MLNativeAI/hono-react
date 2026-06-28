import type { apikey, organization, project } from "../schema";

export type DbOrganization = typeof organization.$inferSelect;
export type DbApiKey = typeof apikey.$inferSelect;
export type DbProject = typeof project.$inferSelect;
