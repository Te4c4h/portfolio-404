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
  const { school, degree, field, startDate, endDate, description } = body;

  const data: Record<string, string> = {};
  if (school !== undefined) data.school = school;
  if (degree !== undefined) data.degree = degree;
  if (field !== undefined) data.field = field;
  if (startDate !== undefined) data.startDate = startDate;
  if (endDate !== undefined) data.endDate = endDate;
  if (description !== undefined) data.description = description;

  const updated = await prisma.resumeEducation.update({
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

  await prisma.resumeEducation.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
