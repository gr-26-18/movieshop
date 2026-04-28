import 'dotenv/config';
import { PrismaClient } from '@/generated/prisma/client'; // Adjusted for standard usage
import { PrismaPg } from '@prisma/adapter-pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  console.log('Starting fresh seed with 20 movies...');

  // 1. Clean the database
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.movie.deleteMany();

  // 2. Movie Data Array
  const movies = [
    {
      title: 'Inception',
      price: 14.99,
      year: 2010,
      img: '/edv3bs1vYvHcnoSgpSst1OBJqs9.jpg',
      desc: 'A thief who steals corporate secrets through dream-sharing technology.',
    },
    {
      title: 'The Dark Knight',
      price: 19.99,
      year: 2008,
      img: '/qJ2tW6WMUDp9QmSJJIVzTVbvSJp.jpg',
      desc: 'Batman faces his greatest psychological and physical test against the Joker.',
    },
    {
      title: 'Interstellar',
      price: 12.99,
      year: 2014,
      img: '/gEU2QniE6EwfVDxjTEreT7p9HTp.jpg',
      desc: 'A team of explorers travel through a wormhole in space to save humanity.',
    },
    {
      title: 'The Matrix',
      price: 9.99,
      year: 1999,
      img: '/f89U3z9vYidpSqc9v3Z7G9YvYv9.jpg',
      desc: 'A computer hacker learns about the true nature of his reality.',
    },
    {
      title: 'Pulp Fiction',
      price: 11.5,
      year: 1994,
      img: '/d5iIlSXY9C1D7R7Jb3vI7GvYv9.jpg',
      desc: 'The lives of hitmen, a boxer, and gangsters intertwine in Los Angeles.',
    },
    {
      title: 'The Godfather',
      price: 25.0,
      year: 1972,
      img: '/3bhkrjSTXvYayRfbwY2p9YvYv9.jpg',
      desc: 'The patriarch of an organized crime dynasty transfers control to his son.',
    },
    {
      title: 'Blade Runner 2049',
      price: 21.0,
      year: 2017,
      img: '/g0S9YvYvYidpSqc9v3Z7G9YvYv9.jpg',
      desc: 'A young blade runner uncovers a secret that could plunge society into chaos.',
    },
    {
      title: 'Joker',
      price: 14.0,
      year: 2019,
      img: '/udDclCheck6n9YvYv9.jpg',
      desc: 'A mentally troubled comedian is disregarded and mistreated by society.',
    },
    {
      title: 'Parasite',
      price: 18.99,
      year: 2019,
      img: '/7IiTT0SBR_count_9YvYv9.jpg',
      desc: 'Greed and class discrimination threaten a relationship between two families.',
    },
    {
      title: 'The Shining',
      price: 8.5,
      year: 1980,
      img: '/x9YvYidpSqc9v3Z7G9YvYv9.jpg',
      desc: 'A family heads to an isolated hotel where a sinister presence influences them.',
    },
  ];

  // 3. Insert Movies and capture IDs for Orders
  const createdMovies = [];
  for (const movie of movies) {
    const created = await prisma.movie.create({
      data: {
        title: movie.title,
        price: movie.price,
        imageUrl: `https://image.tmdb.org/t/p/w500${movie.img}`,
        description: movie.desc,
        releaseDate: new Date(`${movie.year}-01-01`),
      },
    });

    createdMovies.push(created);
  }

  // 4. Create Simulated Orders (to populate "Most Purchased")
  const userId = 'placeholder-user-id';

  // High volume for "Inception" and "The Dark Knight"
  await prisma.order.create({
    data: {
      userId,
      totalAmount: 50.0,
      status: 'COMPLETED',
      orderItems: {
        create: [
          {
            movieId: createdMovies[0].id,
            quantity: 5,
            priceAtPurchase: createdMovies[0].price,
          },
          {
            movieId: createdMovies[1].id,
            quantity: 3,
            priceAtPurchase: createdMovies[1].price,
          },
          {
            movieId: createdMovies[6].id,
            quantity: 2,
            priceAtPurchase: createdMovies[6].price,
          },
        ],
      },
    },
  });

  console.log(`Seeded ${createdMovies.length} movies and simulated orders.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
