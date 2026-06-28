import { db } from "@repo/db/db";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const TABLES = [
  "apikey",
  "project",
  "member",
  "invitation",
  "session",
  "account",
  "verification",
  "organization",
  "user",
] as const;

let migrated = false;

/** Apply drizzle migrations to the test database once per process. */
export async function migrateTestDb() {
  if (migrated) return;
  const migrationsFolder = process.env.MIGRATIONS_FOLDER;
  if (!migrationsFolder) {
    throw new Error("MIGRATIONS_FOLDER must be set by the test preload");
  }
  await migrate(db, { migrationsFolder });
  migrated = true;
}

/** Wipe all rows so every test starts from a clean slate. */
export async function truncateAll() {
  await db.execute(
    sql.raw(`TRUNCATE TABLE ${TABLES.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE`),
  );
}
