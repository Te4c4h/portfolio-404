import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
  const count = await p.user.count();
  console.log("Total users:", count);

  const adminByEmail = await p.user.findFirst({ where: { email: "te4c4h@gmail.com" } });
  console.log("te4c4h@gmail.com:", adminByEmail ? JSON.stringify({ id: adminByEmail.id, username: adminByEmail.username, email: adminByEmail.email }) : "NOT FOUND");

  const adminByUsername = await p.user.findFirst({ where: { username: "admin" } });
  console.log("admin user:", adminByUsername ? JSON.stringify({ id: adminByUsername.id, username: adminByUsername.username, email: adminByUsername.email }) : "NOT FOUND");

  const all = await p.user.findMany({
    select: { id: true, username: true, email: true, subscriptionStatus: true, isFreeAccess: true, isBlocked: true, isPublished: true },
  });
  console.log("All users:", JSON.stringify(all, null, 2));

  const resumes = await p.resume.findMany({ select: { id: true, userId: true, fullName: true } });
  console.log("Resumes:", JSON.stringify(resumes, null, 2));

  await p.$disconnect();
}

main();
