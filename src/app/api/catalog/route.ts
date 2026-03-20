import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HOME_USERNAME } from "@/lib/home-user";
import { isSubscriptionEnabled } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export async function GET() {
  const where: Record<string, unknown> = {
    isPublished: true,
    isBlocked: false,
    username: { notIn: [HOME_USERNAME, "admin"] },
  };

  if (isSubscriptionEnabled()) {
    where.OR = [
      { subscriptionStatus: "active" },
      { isFreeAccess: true },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      username: true,
      firstName: true,
      lastName: true,
      registeredAt: true,
      theme: { select: { accentColor: true, webclipUrl: true } },
      siteContent: { select: { headline: true, subtext: true } },
      _count: { select: { sections: true, contentItems: true } },
    },
    orderBy: { registeredAt: "desc" },
  });

  return NextResponse.json(users);
}
