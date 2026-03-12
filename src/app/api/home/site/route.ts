import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getHomeUserId } from "@/lib/home-user";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const siteContent = await prisma.siteContent.findUnique({
    where: { userId: homeUserId },
  });

  return NextResponse.json(siteContent);
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const body = await req.json();
  const {
    siteTitle, logoText, headline, subtext,
    ctaLabel1, ctaTarget1, ctaLabel2, ctaTarget2,
    aboutText, skills, contactTitle, contactSubtitle,
    footerText, loadingHeading, loadingSubtitle,
  } = body;

  const siteContent = await prisma.siteContent.upsert({
    where: { userId: homeUserId },
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
      userId: homeUserId,
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
