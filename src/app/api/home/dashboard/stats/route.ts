import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getHomeUserId } from "@/lib/home-user";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const [sectionsCount, contentCount, siteContent, sections] = await Promise.all([
    prisma.section.count({ where: { userId: homeUserId } }),
    prisma.contentItem.count({ where: { userId: homeUserId } }),
    prisma.siteContent.findUnique({
      where: { userId: homeUserId },
      select: { updatedAt: true },
    }),
    prisma.section.findMany({
      where: { userId: homeUserId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        _count: { select: { contentItems: true } },
      },
    }),
  ]);

  return NextResponse.json({
    sectionsCount,
    contentCount,
    lastUpdated: siteContent?.updatedAt || null,
    contentPerSection: sections.map((s: { name: string; _count: { contentItems: number } }) => ({
      name: s.name,
      count: s._count.contentItems,
    })),
  });
}
