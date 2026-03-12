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

  const link = await prisma.navLink.findUnique({ where: { id: params.id } });
  if (!link || link.userId !== homeUserId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { label, href } = body;

  const updated = await prisma.navLink.update({
    where: { id: params.id },
    data: {
      ...(label !== undefined && { label }),
      ...(href !== undefined && { href }),
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

  const link = await prisma.navLink.findUnique({ where: { id: params.id } });
  if (!link || link.userId !== homeUserId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.navLink.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
