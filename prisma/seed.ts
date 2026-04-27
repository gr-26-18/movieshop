import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
}) as any;

async function main() {
  console.log("Starting main Postgres seed...");

  // 1. Clean the database
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.movie.deleteMany();

  // 2. Create some movies
  const movie1 = await prisma.movie.create({
    data: {
      title: "Inception",
      price: 14.99,
      imageUrl: "https://image.tmdb.org/t/p/w500/edv3bs1vYvHcnoSgpSst1OBJqs9.jpg",
      description:
        "A thief who steals corporate secrets through the use of dream-sharing technology.",
    },
  });

  const movie2 = await prisma.movie.create({
    data: {
      title: "The Dark Knight",
      price: 19.99,
      imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDp9QmSJJIVzTVbvSJp.jpg",
      description:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
    },
  });

  const movie3 = await prisma.movie.create({
    data: {
      title: "Interstellar",
      price: 12.99,
      imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6EwfVDxjTEreT7p9HTp.jpg",
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    },
  });

  // 3. Create some orders for the placeholder user
  const userId = "placeholder-user-id";

  // Order 1: Completed
  await prisma.order.create({
    data: {
      userId,
      totalAmount: 34.98,
      status: "DELIVERED",
      shippingCity: "New York",
      shippingCountry: "USA",
      orderItems: {
        create: [
          { movieId: movie1.id, quantity: 1, price: 14.99 },
          { movieId: movie2.id, quantity: 1, price: 19.99 },
        ],
      },
    },
  });

  // Order 2: Pending
  await prisma.order.create({
    data: {
      userId,
      totalAmount: 12.99,
      status: "PENDING",
      shippingCity: "London",
      shippingCountry: "UK",
      orderItems: {
        create: [{ movieId: movie3.id, quantity: 1, price: 12.99 }],
      },
    },
  });

  console.log("Main Postgres seed finished successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
