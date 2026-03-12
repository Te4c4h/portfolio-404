import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/api-auth";

export async function GET() {
  const userId = await getEffectiveUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const siteContent = await prisma.siteContent.findUnique({
    where: { userId },
  });

  return NextResponse.json(siteContent);
}

export async function PUT(req: NextRequest) {
  const userId = await getEffectiveUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    siteTitle, logoText, headline, subtext,
    ctaLabel1, ctaTarget1, ctaLabel2, ctaTarget2,
    aboutText, skills, contactTitle, contactSubtitle,
    footerText, loadingHeading, loadingSubtitle,
  } = body;

  const siteContent = await prisma.siteContent.upsert({
    where: { userId },
    update: {
      siteTitle: siteTitle ?? "",
      logoText: logoText ?? "",
      headline: headline ?? "",
      subtext: subtext ?? "",
      ctaLabel1: ctaLabel1 ?? "",
      ctaTarget1: ctaTarget1 ?? "",
      ctaLabel2: ctaLabel2 ?? "",
      ctaTarget2: ctaTarget2 ?? "",
      aboutText: aboutText ?? "",
      skills: skills ?? "",
      contactTitle: contactTitle ?? "",
      contactSubtitle: contactSubtitle ?? "",
      footerText: footerText ?? "",
      loadingHeading: loadingHeading ?? "",
      loadingSubtitle: loadingSubtitle ?? "",
    },
    create: {
      userId,
      siteTitle: siteTitle ?? "",
      logoText: logoText ?? "",
      headline: headline ?? "",
      subtext: subtext ?? "",
      ctaLabel1: ctaLabel1 ?? "",
      ctaTarget1: ctaTarget1 ?? "",
      ctaLabel2: ctaLabel2 ?? "",
      ctaTarget2: ctaTarget2 ?? "",
      aboutText: aboutText ?? "",
      skills: skills ?? "",
      contactTitle: contactTitle ?? "",
      contactSubtitle: contactSubtitle ?? "",
      footerText: footerText ?? "",
      loadingHeading: loadingHeading ?? "",
      loadingSubtitle: loadingSubtitle ?? "",
    },
  });

  return NextResponse.json(siteContent);
}
