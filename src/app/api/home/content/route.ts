import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getHomeUserId } from "@/lib/home-user";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const items = await prisma.contentItem.findMany({
    where: { userId: homeUserId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const homeUserId = await getHomeUserId();
  if (!homeUserId) return NextResponse.json({ error: "Home user not found" }, { status: 404 });

  const body = await req.json();
  const { title, description, tags, coverImage, image1, image2, image3, liveUrl, repoUrl, sectionId, contentType, videoUrl, codeContent, codeLanguage, modelUrl } = body;

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!sectionId) return NextResponse.json({ error: "Section is required" }, { status: 400 });

  const maxOrder = await prisma.contentItem.findFirst({
    where: { userId: homeUserId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const item = await prisma.contentItem.create({
    data: {
      userId: homeUserId,
      sectionId,
      contentType: contentType || "project",
      title,
      description: description || "",
      tags: tags || "",
      coverImage: coverImage || "",
      image1: image1 || "",
      image2: image2 || "",
      image3: image3 || "",
      liveUrl: liveUrl || "",
      repoUrl: repoUrl || "",
      videoUrl: videoUrl || "",
      codeContent: codeContent || "",
      codeLanguage: codeLanguage || "",
      modelUrl: modelUrl || "",
      order: (maxOrder?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
