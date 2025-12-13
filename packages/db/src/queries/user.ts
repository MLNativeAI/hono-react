import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../schema";

export async function getUserById({ userId }: { userId: string }) {
  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });
  return userData;
}

export async function getUserByEmail({ email }: { email: string }) {
  const userData = await db.query.user.findFirst({
    where: eq(user.email, email),
  });
  return userData;
}
