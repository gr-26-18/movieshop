import { prisma } from '@/lib/prisma';
import 'dotenv/config';


async function main() {
  console.log('Starting fresh seed with 20 movies...');

  // 1. Clean the database
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany(); // ADDED: Clean genres

  // 2. Movie Data
  const movieData = [
    {
      title: 'Spider-Man: Across the Spider-Verse',
      price: 19.99,
      year: 2023,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg',
      description:
        'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
      genres: ['Animation', 'Action', 'Adventure'],
    },
    {
      title: 'The Batman',
      price: 15.5,
      year: 2022,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_SX300.jpg',
      description:
        "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
      genres: ['Action', 'Crime', 'Drama'],
    },
    {
      title: 'Everything Everywhere All at Once',
      price: 14.0,
      year: 2022,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg',
      description:
        'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes.',
      genres: ['Action', 'Adventure', 'Comedy'],
    },
    {
      title: 'Dune',
      price: 16.99,
      year: 2021,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNWIyNmU5MGYtZDZmNi00ZjAwLWJlYjgtZTc0ZGIxMDE4ZGYwXkEyXkFqcGc@._V1_QL75_UY562_CR1,0,380,562_.jpg',
      description:
        "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir is troubled by visions of a dark future.",
      genres: ['Action', 'Adventure', 'Sci-Fi'],
    },
    {
      title: 'Fight Club',
      price: 9.99,
      year: 1999,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
      description:
        'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
      genres: ['Drama'],
    },
    {
      title: 'Spirited Away',
      price: 18.0,
      year: 2001,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNTEyNmEwOWUtYzkyOC00ZTQ4LTllZmUtMjk0Y2YwOGUzYjRiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
      description:
        "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
      genres: ['Animation', 'Adventure', 'Family'],
    },
    {
      title: 'Goodfellas',
      price: 11.99,
      year: 1990,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BN2E5NzI2ZGMtY2VjNi00YTRjLWI1MDUtZGY5OWU1MWJjZjRjXkEyXkFqcGc@._V1_QL75_UX380_CR0,3,380,562_.jpg',
      description:
        'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.',
      genres: ['Biography', 'Crime', 'Drama'],
    },
    {
      title: 'Alien',
      price: 8.99,
      year: 1979,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BN2NhMDk2MmEtZDQzOC00MmY5LThhYzAtMDdjZGFjOGZjMjdjXkEyXkFqcGc@._V1_QL75_UX380_CR0,6,380,562_.jpg',
      description:
        'After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form.',
      genres: ['Horror', 'Sci-Fi'],
    },
    {
      title: 'Inception',
      price: 14.99,
      year: 2010,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      description: 'A thief who steals corporate secrets...',
      genres: ['Action', 'Adventure', 'Sci-Fi'],
    },
    {
      title: 'The Dark Knight',
      price: 19.99,
      year: 2008,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
      description: 'Batman faces the Joker...',
      genres: ['Action', 'Crime', 'Drama'],
    },
    {
      title: 'Interstellar',
      price: 12.99,
      year: 2014,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      description: 'Explorers travel through a wormhole...',
      genres: ['Adventure', 'Drama', 'Sci-Fi'],
    },
    {
      title: 'The Matrix',
      price: 10.99,
      year: 1999,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
      description:
        'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
      genres: ['Action', 'Sci-Fi'],
    },
    {
      title: 'Pulp Fiction',
      price: 12.99,
      year: 1994,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_QL75_UY562_CR3,0,380,562_.jpg',
      description:
        'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      genres: ['Crime', 'Drama'],
    },
    {
      title: 'Parasite',
      price: 14.5,
      year: 2019,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_SX300.jpg',
      description:
        'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
      genres: ['Drama', 'Thriller'],
    },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      price: 15,
      year: 2001,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_SX300.jpg',
      description:
        'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
      genres: ['Action', 'Adventure', 'Drama'],
    },
    {
      title: 'The Godfather',
      price: 11.99,
      year: 1972,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY562_CR8,0,380,562_.jpg',
      description:
        'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      genres: ['Crime', 'Drama'],
    },
    {
      title: 'Forrest Gump',
      price: 9.99,
      year: 1994,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg',
      description:
        "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.",
      genres: ['Drama', 'Romance'],
    },
    {
      title: 'Gladiator',
      price: 13.99,
      year: 2000,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1ZmJiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
      description:
        'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
      genres: ['Action', 'Adventure', 'Drama'],
    },
    {
      title: 'Avengers: Endgame',
      price: 19.99,
      year: 2019,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_QL75_UX380_CR0,0,380,562_.jpg',
      description:
        "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
      genres: ['Action', 'Adventure', 'Sci-Fi'],
    },
    {
      title: 'Jurassic Park',
      price: 8.99,
      year: 1993,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_SX300.jpg',
      description:
        "An industrialist invites some experts to visit his theme park of cloned dinosaurs. After a power failure, the creatures run loose, putting everyone's lives, including his grandchildren's, in danger.",
      genres: ['Action', 'Adventure', 'Sci-Fi'],
    },
  ];

  // 3. Insert Movies and store them in an array
  const createdMovies = [];
  for (const movie of movieData) {
    const created = await prisma.movie.create({
      data: {
        title: movie.title,
        price: Math.round(movie.price * 100),
        imageUrl: movie.imageUrl,
        description: movie.description,
        releaseDate: new Date(`${movie.year}-01-01`),
        genres: {
          connectOrCreate: movie.genres.map((genreName) => ({
            where: { name: genreName },
            create: { name: genreName },
          })),
        },
      },
    });
    createdMovies.push(created);
  }

  // 4. Create Simulated Orders
  const userId = 'placeholder-user-id';

  // Verify we actually have movies before trying to use their IDs
  if (createdMovies.length >= 3) {
    await prisma.order.create({
      data: {
        userId,
        totalAmount: 4797,
        status: 'COMPLETED',
        orderItems: {
          create: [
            {
              movieId: createdMovies[0].id,
              quantity: 1,
              priceAtPurchase: createdMovies[0].price,
            },
            {
              movieId: createdMovies[1].id,
              quantity: 1,
              priceAtPurchase: createdMovies[1].price,
            },
            {
              movieId: createdMovies[2].id,
              quantity: 1,
              priceAtPurchase: createdMovies[2].price,
            },
          ],
        },
      },
    });
  }

  console.log(`Successfully seeded ${createdMovies.length} movies!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
