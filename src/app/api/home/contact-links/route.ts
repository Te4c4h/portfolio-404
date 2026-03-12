import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getHomeUserId } from "@/lib/home-user";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const links = await prisma.contactLink.findMany({
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
  const { platform, url } = body;

  if (!platform) return NextResponse.json({ error: "Platform is required" }, { status: 400 });
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  const maxOrder = await prisma.contactLink.findFirst({
    where: { userId: homeUserId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const link = await prisma.contactLink.create({
    data: {
      userId: homeUserId,
      platform,
      url,
      order: (maxOrder?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(link, { status: 201 });
}
