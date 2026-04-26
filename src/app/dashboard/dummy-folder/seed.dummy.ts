import { PrismaClient, OrderStatus } from "../../../generated/prisma-dashboard/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl =
  process.env.DUMMY_DATABASE_URL ?? "file:./src/app/dashboard/dummy-folder/dashboard-dev.db";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: databaseUrl }),
});

async function main() {
  console.log("Starting seed...");

  // 1. Clean the database
  const userId = "placeholder-user-id";

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
  // Order 1: Delivered
  await prisma.order.create({
    data: {
      userId,
      totalAmount: 34.98,
      status: OrderStatus.DELIVERED,
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
      status: OrderStatus.PENDING,
      shippingCity: "London",
      shippingCountry: "UK",
      orderItems: {
        create: [{ movieId: movie3.id, quantity: 1, price: 12.99 }],
      },
    },
  });

  console.log("Seed finished successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
