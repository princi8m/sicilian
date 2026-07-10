import { PrismaClient, DateType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Admin" },
  });
  console.log(`Admin ready: ${email}`);

  // --- Site settings ---
  const settings: Record<string, string> = {
    festival_name: "Sicilian Film Awards",
    header_image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600",
    logo: "",
    contact_email: "info@sicilianfilmawards.com",
    instagram: "",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  // --- Home blocks ---
  const blockCount = await prisma.homeBlock.count();
  if (blockCount === 0) {
    await prisma.homeBlock.create({
      data: {
        title: "Submissions now open",
        body: "The next edition is accepting short films, features and documentaries. See the Dates page for deadlines.",
        order: 0,
      },
    });
  }

  // --- An edition with winners ---
  const existing = await prisma.edition.findFirst();
  if (!existing) {
    await prisma.edition.create({
      data: {
        year: 2026,
        month: 6,
        title: "June 2026 Edition",
        slug: "2026-06",
        published: true,
        winners: {
          create: [
            { category: "Best Film", filmTitle: "The Long Night", recipient: "Dir. A. Rossi", country: "IT", order: 0 },
            { category: "Best Director", filmTitle: "Northbound", recipient: "M. Klein", country: "DE", order: 1 },
            { category: "Best Documentary", filmTitle: "Salt & Iron", recipient: "L. Ferreira", country: "PT", order: 2 },
          ],
        },
      },
    });
  }

  // --- Featured films (home carousel) ---
  if ((await prisma.featuredFilm.count()) === 0) {
    await prisma.featuredFilm.createMany({
      data: [
        { title: "The Long Night", previewImage: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800", order: 0 },
        { title: "Northbound", previewImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800", order: 1 },
        { title: "Salt & Iron", previewImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800", order: 2 },
      ],
    });
  }

  // --- Event photos ---
  if ((await prisma.eventPhoto.count()) === 0) {
    await prisma.eventPhoto.createMany({
      data: [
        { imagePath: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=900", caption: "Opening night", featuredOnHome: true, order: 0 },
        { imagePath: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900", caption: "Q&A session", featuredOnHome: true, order: 1 },
      ],
    });
  }

  // --- Reviews ---
  if ((await prisma.filmReview.count()) === 0) {
    await prisma.filmReview.create({
      data: {
        slug: "the-long-night",
        filmTitle: "The Long Night",
        director: "A. Rossi",
        body: "A quietly devastating debut that lingers long after the credits roll.",

        published: true,
        publishedAt: new Date(),
      },
    });
  }

  // --- Dates ---
  if ((await prisma.eventDate.count()) === 0) {
    await prisma.eventDate.createMany({
      data: [
        { title: "Early-bird submission deadline", type: DateType.DEADLINE, startsAt: new Date("2026-08-15T23:59:00") },
        { title: "Awards ceremony", type: DateType.EVENT, startsAt: new Date("2026-10-03T19:00:00"), location: "Palermo" },
      ],
    });
  }

  // --- Products ---
  if ((await prisma.product.count()) === 0) {
    await prisma.product.createMany({
      data: [
        { name: "Laurel Trophy", description: "Engraved official festival trophy.", priceCents: 8900, currency: "EUR", order: 0 },
        { name: "Winner Certificate (printed)", description: "Premium printed and framed certificate.", priceCents: 3500, currency: "EUR", order: 1 },
      ],
    });
  }

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
