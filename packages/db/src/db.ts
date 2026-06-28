import { env } from "@repo/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle({ client: queryClient, schema });
