import { prisma } from "@/lib/prisma";

const HOME_USERNAME = "__home__";

export async function getHomeUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { username: HOME_USERNAME },
    select: { id: true },
  });
  return user?.id ?? null;
}

export { HOME_USERNAME };
