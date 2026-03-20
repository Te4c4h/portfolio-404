import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
  const resumes = await p.resume.findMany({ select: { id: true, userId: true, fullName: true } });
  console.log("Resumes:", JSON.stringify(resumes, null, 2));

  const users = await p.user.findMany({
    select: { id: true, username: true, email: true, subscriptionStatus: true, isFreeAccess: true },
  });
  console.log("Users:", JSON.stringify(users, null, 2));

  await p.$disconnect();
}

main();
