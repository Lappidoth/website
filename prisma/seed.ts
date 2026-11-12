import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const candles = [
  {
    slug: "involved",
    name: "Involved",
    theme: "Indulgence",
    scent: "Honey vanilla",
    tagline: "Permission in a jar.",
    description:
      "A golden, honeyed warmth for the moments you give yourself permission to slow down and simply enjoy.",
    inspiration: "Inspired by the gift of eternal life in John 3:16.",
    image: "/images/product-involved.jpg",
    sortOrder: 1,
  },
  {
    slug: "so-loved",
    name: "So Loved",
    theme: "Receiving",
    scent: "Warm vanilla and amber",
    tagline: "Like a hug.",
    description:
      "It smells like a hug — the kind of warmth that makes you want to stay. Hand-finished with rose petals.",
    inspiration: "Inspired by God\u2019s unconditional love in John 3:16.",
    image: "/images/product-so-loved.jpg",
    sortOrder: 2,
  },
  {
    slug: "connect",
    name: "Connect",
    theme: "Relationship",
    scent: "Vanilla and sweet orange",
    tagline: "Stay a little longer.",
    description: "It invites you to linger and share a moment. A rare thing to bottle.",
    inspiration: "Inspired by the giving in John 3:16.",
    image: "/images/product-connect.jpg",
    sortOrder: 3,
  },
];

const sets = [
  {
    slug: "the-presence-duo",
    name: "The Presence Duo",
    setSize: 2,
    tagline: "Choose any two.",
    description:
      "Pair two candles from The Presence Collection — for yourself, or to give someone a moment of intentional peace.",
    priceCents: 3800,
    image: "/images/product-so-loved.jpg",
    sortOrder: 10,
  },
  {
    slug: "the-presence-trio",
    name: "The Presence Trio",
    setSize: 3,
    tagline: "The complete collection.",
    description:
      "Involved, So Loved and Connect together — or choose your own three. Our most considered gift.",
    priceCents: 5400,
    image: "/images/hero-presence-collection.jpg",
    sortOrder: 11,
  },
];

async function main() {
  const collection = await prisma.collection.upsert({
    where: { slug: "the-presence-collection" },
    update: {},
    create: {
      slug: "the-presence-collection",
      name: "The Presence Collection",
      description: "Hand-poured with intention. Crafted to shape atmosphere.",
    },
  });

  for (const c of candles) {
    const data = { ...c, type: "CANDLE", priceCents: 2000, collectionId: collection.id };
    await prisma.product.upsert({ where: { slug: c.slug }, update: data, create: data });
  }
  for (const s of sets) {
    const data = { ...s, type: "SET", collectionId: collection.id };
    await prisma.product.upsert({ where: { slug: s.slug }, update: data, create: data });
  }
  console.log(`Seeded ${candles.length} candles and ${sets.length} sets.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
