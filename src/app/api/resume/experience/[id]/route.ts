import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/api-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { company, position, location, startDate, endDate, description } = body;

  const data: Record<string, string> = {};
  if (company !== undefined) data.company = company;
  if (position !== undefined) data.position = position;
  if (location !== undefined) data.location = location;
  if (startDate !== undefined) data.startDate = startDate;
  if (endDate !== undefined) data.endDate = endDate;
  if (description !== undefined) data.description = description;

  const updated = await (prisma as any).resumeExperience.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await (prisma as any).resumeExperience.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
