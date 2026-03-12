import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getHomeUserId } from "@/lib/home-user";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const theme = await prisma.theme.findUnique({ where: { userId: homeUserId } });
  return NextResponse.json(theme);
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const body = await req.json();
  const {
    accentColor, backgroundColor, surfaceColor, textColor,
    dangerColor, cursorColor, bodyFont, headingFont,
    logoUrl, faviconUrl, webclipUrl, websiteTitle, gridColor,
  } = body;

  const data = {
    accentColor: accentColor ?? "#70E844",
    backgroundColor: backgroundColor ?? "#131313",
    surfaceColor: surfaceColor ?? "#181818",
    textColor: textColor ?? "#fafafa",
    dangerColor: dangerColor ?? "#FE454E",
    cursorColor: cursorColor ?? "#70E844",
    bodyFont: bodyFont ?? "Inter",
    headingFont: headingFont ?? "Syne",
    logoUrl: logoUrl ?? "",
    faviconUrl: faviconUrl ?? "",
    webclipUrl: webclipUrl ?? "",
    websiteTitle: websiteTitle ?? "",
    gridColor: gridColor ?? "rgba(255,255,255,0.03)",
  };

  const theme = await prisma.theme.upsert({
    where: { userId: homeUserId },
    update: data,
    create: { userId: homeUserId, ...data },
  });

  return NextResponse.json(theme);
}
