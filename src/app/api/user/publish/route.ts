import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isPublished: true },
  });

  return NextResponse.json({ isPublished: dbUser?.isPublished ?? false });
}

export async function PUT() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isPublished: true },
  });

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { isPublished: !dbUser?.isPublished },
    select: { isPublished: true },
  });

  return NextResponse.json({ isPublished: updated.isPublished });
}
