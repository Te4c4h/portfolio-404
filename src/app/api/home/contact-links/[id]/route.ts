import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getHomeUserId } from "@/lib/home-user";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const link = await prisma.contactLink.findUnique({ where: { id: params.id } });
  if (!link || link.userId !== homeUserId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { platform, url } = body;

  const updated = await prisma.contactLink.update({
    where: { id: params.id },
    data: {
      ...(platform !== undefined && { platform }),
      ...(url !== undefined && { url }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const link = await prisma.contactLink.findUnique({ where: { id: params.id } });
  if (!link || link.userId !== homeUserId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.contactLink.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
