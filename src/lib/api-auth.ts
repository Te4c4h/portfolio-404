import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHomeUserId } from "@/lib/home-user";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) return null;
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || !user.isAdmin) return null;
  return user;
}

/**
 * Returns the effective user ID for data operations.
 * Admin users → __home__ user ID (they manage the home page).
 * Regular users → their own ID.
 */
export async function getEffectiveUserId(): Promise<string | null> {
  const user = await getSessionUser();
  if (!user) return null;
  if (user.isAdmin) {
    return await getHomeUserId();
  }
  return user.id;
}
