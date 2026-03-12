import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getHomeUserId } from "@/lib/home-user";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const links = await prisma.navLink.findMany({
    where: { userId: homeUserId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const body = await req.json();
  const { label, href } = body;

  if (!label || !href) {
    return NextResponse.json({ error: "Label and href are required" }, { status: 400 });
  }

  const maxOrder = await prisma.navLink.findFirst({
    where: { userId: homeUserId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const link = await prisma.navLink.create({
    data: {
      userId: homeUserId,
      label,
      href,
      order: (maxOrder?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(link, { status: 201 });
}
