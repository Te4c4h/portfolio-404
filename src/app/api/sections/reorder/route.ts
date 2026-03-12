import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/api-auth";

export async function PUT(req: NextRequest) {
  const userId = await getEffectiveUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { items } = body as { items: { id: string; order: number }[] };

  if (!items || !Array.isArray(items)) {
    return NextResponse.json({ error: "Items array is required" }, { status: 400 });
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.section.updateMany({
        where: { id: item.id, userId },
        data: { order: item.order },
      })
    )
  );

  return NextResponse.json({ success: true });
}
