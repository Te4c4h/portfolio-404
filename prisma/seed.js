const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const HOME_USERNAME = "__home__";

  const existing = await prisma.user.findUnique({
    where: { username: HOME_USERNAME },
  });

  if (existing) {
    console.log("__home__ user already exists, skipping seed.");
    return;
  }

  const hashedPassword = await hash("__home__internal__", 12);

  await prisma.$transaction(async (tx) => {
    const homeUser = await tx.user.create({
      data: {
        username: HOME_USERNAME,
        firstName: "Portfolio",
        lastName: "404",
        email: "__home__@internal.system",
        password: hashedPassword,
      },
    });

    await tx.siteContent.create({
      data: {
        userId: homeUser.id,
        siteTitle: "Portfolio 404",
        logoText: "Portfolio 404",
        headline: "Creative Portfolios, Instantly",
        subtext: "Build and share your professional portfolio in minutes.",
        ctaLabel1: "Explore",
        ctaLabel2: "Get Started",
        ctaTarget2: "#contact",
        contactTitle: "Get Started",
        contactSubtitle: "Create your own portfolio today",
        loadingHeading: "Portfolio 404",
        loadingSubtitle: "Loading",
        footerText: "© " + new Date().getFullYear() + " Portfolio 404",
      },
    });

    await tx.theme.create({
      data: {
        userId: homeUser.id,
      },
    });

    const featuredSection = await tx.section.create({
      data: {
        userId: homeUser.id,
        name: "Featured",
        slug: "featured",
        label: "Featured",
        subtitle: "Highlighted portfolios and projects",
        order: 0,
      },
    });

    await tx.contentItem.create({
      data: {
        userId: homeUser.id,
        sectionId: featuredSection.id,
        title: "Sample Project",
        description: "This is a sample project to get you started. Edit or replace it from the admin dashboard.",
        tags: "Portfolio,Sample",
        order: 0,
      },
    });

    await tx.navLink.create({
      data: { userId: homeUser.id, label: "Featured", href: "#featured", order: 0 },
    });
    await tx.navLink.create({
      data: { userId: homeUser.id, label: "Contact", href: "#contact", order: 1 },
    });
  });

  console.log("__home__ user seeded successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
