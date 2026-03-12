import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getHomeUserId } from "@/lib/home-user";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const sections = await prisma.section.findMany({
    where: { userId: homeUserId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(sections);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const body = await req.json();
  const { name, label, subtitle, backgroundColor } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const existing = await prisma.section.findUnique({
    where: { userId_slug: { userId: homeUserId, slug } },
  });
  if (existing) {
    return NextResponse.json({ error: "A section with this name already exists" }, { status: 409 });
  }

  const maxOrder = await prisma.section.findFirst({
    where: { userId: homeUserId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const section = await prisma.section.create({
    data: {
      userId: homeUserId,
      name,
      slug,
      label: label || name,
      subtitle: subtitle || "",
      backgroundColor: backgroundColor || "#181818",
      order: (maxOrder?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(section, { status: 201 });
}
