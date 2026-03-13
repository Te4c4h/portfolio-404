import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/api-auth";

async function getResumeId(userId: string): Promise<string | null> {
  const resume = await prisma.resume.findUnique({
    where: { userId },
    select: { id: true },
  });
  return resume?.id ?? null;
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resumeId = await getResumeId(user.id);
  if (!resumeId) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const body = await req.json();
  const { company, position, location, startDate, endDate, description } = body;

  const maxOrder = await prisma.resumeExperience.findFirst({
    where: { resumeId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const exp = await prisma.resumeExperience.create({
    data: {
      resumeId,
      company: company || "",
      position: position || "",
      location: location || "",
      startDate: startDate || "",
      endDate: endDate || "",
      description: description || "",
      order: (maxOrder?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(exp, { status: 201 });
}
