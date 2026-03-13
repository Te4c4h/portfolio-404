import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/api-auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let resume = await (prisma as any).resume.findUnique({
    where: { userId: user.id },
    include: {
      experiences: { orderBy: { order: "asc" } },
      educations: { orderBy: { order: "asc" } },
      skills: { orderBy: { order: "asc" } },
    },
  });

  if (!resume) {
    resume = await (prisma as any).resume.create({
      data: {
        userId: user.id,
        fullName: `${user.username}`,
      },
      include: {
        experiences: { orderBy: { order: "asc" } },
        educations: { orderBy: { order: "asc" } },
        skills: { orderBy: { order: "asc" } },
      },
    });
  }

  return NextResponse.json(resume);
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { templateId, fullName, jobTitle, email, phone, location, website, summary, showOnPortfolio } = body;

  const resume = await (prisma as any).resume.upsert({
    where: { userId: user.id },
    update: {
      templateId: templateId ?? "classic",
      fullName: fullName ?? "",
      jobTitle: jobTitle ?? "",
      email: email ?? "",
      phone: phone ?? "",
      location: location ?? "",
      website: website ?? "",
      summary: summary ?? "",
      showOnPortfolio: showOnPortfolio ?? false,
    },
    create: {
      userId: user.id,
      templateId: templateId ?? "classic",
      fullName: fullName ?? "",
      jobTitle: jobTitle ?? "",
      email: email ?? "",
      phone: phone ?? "",
      location: location ?? "",
      website: website ?? "",
      summary: summary ?? "",
      showOnPortfolio: showOnPortfolio ?? false,
    },
  });

  return NextResponse.json(resume);
}
