import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// NOTE: prices and scent notes below are placeholders — replace with the real ones.
const products = [
  {
    slug: "so-loved",
    name: "So Loved",
    tagline: "A room held in warmth.",
    description:
      "Crowned with dried rose petals and poured slowly by hand, So Loved is soft, enveloping and quietly romantic — the scent of being fully known and wholly welcomed.",
    topNotes: "Pink pepper, bergamot",
    heartNotes: "Damask rose, peony",
    baseNotes: "Vanilla bean, cashmere musk",
    priceCents: 3800,
    image: "/images/candle-so-loved.jpg",
    sortOrder: 1,
  },
  {
    slug: "involved",
    name: "Involved",
    tagline: "For lingering tables and long conversations.",
    description:
      "Grounded and generous, Involved is made for the moments you choose to stay — evenings around the table, slow mornings, the people you show up for.",
    topNotes: "Fig leaf, citrus peel",
    heartNotes: "White tea, jasmine",
    baseNotes: "Cedarwood, amber",
    priceCents: 3800,
    image: "/images/candle-involved.jpg",
    sortOrder: 2,
  },
  {
    slug: "connect",
    name: "Connect",
    tagline: "Clear air. Open heart.",
    description:
      "Bright and botanical, Connect clears the noise and makes space to be present — with yourself, with others, with what matters.",
    topNotes: "Eucalyptus, mint",
    heartNotes: "Sage, lavender",
    baseNotes: "Driftwood, white musk",
    priceCents: 3800,
    image: "/images/candle-connect.jpg",
    sortOrder: 3,
  },
];

async function main() {
  const collection = await prisma.collection.upsert({
    where: { slug: "the-presence-collection" },
    update: {},
    create: {
      slug: "the-presence-collection",
      name: "The Presence Collection",
      description:
        "Three hand-poured candles crafted to shape atmosphere and invite presence into every room.",
    },
  });

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...p, collectionId: collection.id },
      create: { ...p, collectionId: collection.id },
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
