import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { username, contactType } = await req.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }
    if (!contactType || typeof contactType !== "string") {
      return NextResponse.json({ error: "Missing contactType" }, { status: 400 });
    }

    await prisma.contactClick.create({
      data: {
        username,
        contactType,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
