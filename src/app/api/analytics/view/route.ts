import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { username, referrer } = await req.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    await prisma.pageView.create({
      data: {
        username,
        referrer: referrer || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
