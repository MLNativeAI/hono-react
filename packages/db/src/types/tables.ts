
import type {
  apikey,
  organization,
} from "../schema";

export type DbOrganization = typeof organization.$inferSelect;
export type DbApiKey = typeof apikey.$inferSelect;
