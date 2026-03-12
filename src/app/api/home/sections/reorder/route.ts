import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getHomeUserId } from "@/lib/home-user";

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const body = await req.json();
  const { items } = body as { items: { id: string; order: number }[] };

  if (!items || !Array.isArray(items)) {
    return NextResponse.json({ error: "Items array is required" }, { status: 400 });
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.section.updateMany({
        where: { id: item.id, userId: homeUserId },
        data: { order: item.order },
      })
    )
  );

  return NextResponse.json({ success: true });
}
