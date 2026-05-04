import { prisma } from '@/lib/prisma';
import 'dotenv/config';

async function main() {
  console.log('Starting fresh seed with 20 movies and all related tables...');

  // 1. Clean the database
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.movieCredit.deleteMany();
  await prisma.person.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();

  // 2. Movie Data
  const movieData = [
    {
      title: 'Spider-Man: Across the Spider-Verse',
      price: 199,
      releaseDate: new Date('2023-01-01'),
      runtime: 140,
      rating: 4.8,
      stock: 15,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg',
      description:
        'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
      genres: ['Animation', 'Action', 'Adventure'],
      credits: [
        { name: 'Joaquim Dos Santos', role: 'DIRECTOR' },
        { name: 'Kemp Powers', role: 'DIRECTOR' },
        { name: 'Justin K. Thompson', role: 'DIRECTOR' },
        { name: 'Shameik Moore', role: 'ACTOR' },
        { name: 'Hailee Steinfeld', role: 'ACTOR' },
        { name: 'Brian Tyree Henry', role: 'ACTOR' },
      ],
    },
    {
      title: 'The Batman',
      price: 155,
      releaseDate: new Date('2022-01-01'),
      runtime: 176,
      rating: 4.5,
      stock: 12,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_SX300.jpg',
      description:
        "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
      genres: ['Action', 'Crime', 'Drama'],
      credits: [
        { name: 'Matt Reeves', role: 'DIRECTOR' },
        { name: 'Robert Pattinson', role: 'ACTOR' },
        { name: 'Zoë Kravitz', role: 'ACTOR' },
        { name: 'Jeffrey Wright', role: 'ACTOR' },
      ],
    },
    {
      title: 'Everything Everywhere All at Once',
      price: 140,
      releaseDate: new Date('2022-01-01'),
      runtime: 139,
      rating: 4.7,
      stock: 8,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg',
      description:
        'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes.',
      genres: ['Action', 'Adventure', 'Comedy'],
      credits: [
        { name: 'Daniel Kwan', role: 'DIRECTOR' },
        { name: 'Daniel Scheinert', role: 'DIRECTOR' },
        { name: 'Michelle Yeoh', role: 'ACTOR' },
        { name: 'Stephanie Hsu', role: 'ACTOR' },
        { name: 'Ke Huy Quan', role: 'ACTOR' },
      ],
    },
    {
      title: 'Dune',
      price: 169,
      releaseDate: new Date('2021-01-01'),
      runtime: 155,
      rating: 4.6,
      stock: 20,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNWIyNmU5MGYtZDZmNi00ZjAwLWJlYjgtZTc0ZGIxMDE4ZGYwXkEyXkFqcGc@._V1_QL75_UY562_CR1,0,380,562_.jpg',
      description:
        "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir is troubled by visions of a dark future.",
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      credits: [
        { name: 'Denis Villeneuve', role: 'DIRECTOR' },
        { name: 'Timothée Chalamet', role: 'ACTOR' },
        { name: 'Rebecca Ferguson', role: 'ACTOR' },
        { name: 'Zendaya', role: 'ACTOR' },
      ],
    },
    {
      title: 'Fight Club',
      price: 99,
      releaseDate: new Date('1999-01-01'),
      runtime: 139,
      rating: 4.9,
      stock: 5,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
      description:
        'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
      genres: ['Drama'],
      credits: [
        { name: 'David Fincher', role: 'DIRECTOR' },
        { name: 'Brad Pitt', role: 'ACTOR' },
        { name: 'Edward Norton', role: 'ACTOR' },
        { name: 'Meat Loaf', role: 'ACTOR' },
      ],
    },
    {
      title: 'Spirited Away',
      price: 180,
      releaseDate: new Date('2001-01-01'),
      runtime: 125,
      rating: 4.8,
      stock: 10,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNTEyNmEwOWUtYzkyOC00ZTQ4LTllZmUtMjk0Y2YwOGUzYjRiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
      description:
        "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
      genres: ['Animation', 'Adventure', 'Family'],
      credits: [
        { name: 'Hayao Miyazaki', role: 'DIRECTOR' },
        { name: 'Daveigh Chase', role: 'ACTOR' },
        { name: 'Suzanne Pleshette', role: 'ACTOR' },
        { name: 'Miyu Irino', role: 'ACTOR' },
      ],
    },
    {
      title: 'Goodfellas',
      price: 119,
      releaseDate: new Date('1990-01-01'),
      runtime: 145,
      rating: 4.8,
      stock: 7,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BN2E5NzI2ZGMtY2VjNi00YTRjLWI1MDUtZGY5OWU1MWJjZjRjXkEyXkFqcGc@._V1_QL75_UX380_CR0,3,380,562_.jpg',
      description:
        'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.',
      genres: ['Biography', 'Crime', 'Drama'],
      credits: [
        { name: 'Martin Scorsese', role: 'DIRECTOR' },
        { name: 'Robert De Niro', role: 'ACTOR' },
        { name: 'Ray Liotta', role: 'ACTOR' },
        { name: 'Joe Pesci', role: 'ACTOR' },
      ],
    },
    {
      title: 'Alien',
      price: 89,
      releaseDate: new Date('1979-01-01'),
      runtime: 117,
      rating: 4.7,
      stock: 15,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BN2NhMDk2MmEtZDQzOC00MmY5LThhYzAtMDdjZGFjOGZjMjdjXkEyXkFqcGc@._V1_QL75_UX380_CR0,6,380,562_.jpg',
      description:
        'After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form.',
      genres: ['Horror', 'Sci-Fi'],
      credits: [
        { name: 'Ridley Scott', role: 'DIRECTOR' },
        { name: 'Sigourney Weaver', role: 'ACTOR' },
        { name: 'Tom Skerritt', role: 'ACTOR' },
        { name: 'John Hurt', role: 'ACTOR' },
      ],
    },
    {
      title: 'Inception',
      price: 149,
      releaseDate: new Date('2010-01-01'),
      runtime: 148,
      rating: 4.8,
      stock: 25,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      description:
        'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      credits: [
        { name: 'Christopher Nolan', role: 'DIRECTOR' },
        { name: 'Leonardo DiCaprio', role: 'ACTOR' },
        { name: 'Joseph Gordon-Levitt', role: 'ACTOR' },
        { name: 'Elliot Page', role: 'ACTOR' },
      ],
    },
    {
      title: 'The Dark Knight',
      price: 199,
      releaseDate: new Date('2008-01-01'),
      runtime: 152,
      rating: 4.9,
      stock: 30,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
      description:
        'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      genres: ['Action', 'Crime', 'Drama'],
      credits: [
        { name: 'Christopher Nolan', role: 'DIRECTOR' },
        { name: 'Christian Bale', role: 'ACTOR' },
        { name: 'Heath Ledger', role: 'ACTOR' },
        { name: 'Aaron Eckhart', role: 'ACTOR' },
      ],
    },
    {
      title: 'Interstellar',
      price: 129,
      releaseDate: new Date('2014-01-01'),
      runtime: 169,
      rating: 4.7,
      stock: 18,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      description:
        "Explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      genres: ['Adventure', 'Drama', 'Sci-Fi'],
      credits: [
        { name: 'Christopher Nolan', role: 'DIRECTOR' },
        { name: 'Matthew McConaughey', role: 'ACTOR' },
        { name: 'Anne Hathaway', role: 'ACTOR' },
        { name: 'Jessica Chastain', role: 'ACTOR' },
      ],
    },
    {
      title: 'The Matrix',
      price: 109,
      releaseDate: new Date('1999-01-01'),
      runtime: 136,
      rating: 4.8,
      stock: 10,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
      description:
        'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
      genres: ['Action', 'Sci-Fi'],
      credits: [
        { name: 'Lana Wachowski', role: 'DIRECTOR' },
        { name: 'Lilly Wachowski', role: 'DIRECTOR' },
        { name: 'Keanu Reeves', role: 'ACTOR' },
        { name: 'Laurence Fishburne', role: 'ACTOR' },
        { name: 'Carrie-Anne Moss', role: 'ACTOR' },
      ],
    },
    {
      title: 'Pulp Fiction',
      price: 129,
      releaseDate: new Date('1994-01-01'),
      runtime: 154,
      rating: 4.9,
      stock: 14,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_QL75_UY562_CR3,0,380,562_.jpg',
      description:
        'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      genres: ['Crime', 'Drama'],
      credits: [
        { name: 'Quentin Tarantino', role: 'DIRECTOR' },
        { name: 'John Travolta', role: 'ACTOR' },
        { name: 'Uma Thurman', role: 'ACTOR' },
        { name: 'Samuel L. Jackson', role: 'ACTOR' },
      ],
    },
    {
      title: 'Parasite',
      price: 145,
      releaseDate: new Date('2019-01-01'),
      runtime: 132,
      rating: 4.7,
      stock: 22,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_SX300.jpg',
      description:
        'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
      genres: ['Drama', 'Thriller'],
      credits: [
        { name: 'Bong Joon Ho', role: 'DIRECTOR' },
        { name: 'Song Kang-ho', role: 'ACTOR' },
        { name: 'Lee Sun-kyun', role: 'ACTOR' },
        { name: 'Cho Yeo-jeong', role: 'ACTOR' },
      ],
    },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      price: 150,
      releaseDate: new Date('2001-01-01'),
      runtime: 178,
      rating: 4.8,
      stock: 15,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_SX300.jpg',
      description:
        'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
      genres: ['Action', 'Adventure', 'Drama'],
      credits: [
        { name: 'Peter Jackson', role: 'DIRECTOR' },
        { name: 'Elijah Wood', role: 'ACTOR' },
        { name: 'Ian McKellen', role: 'ACTOR' },
        { name: 'Orlando Bloom', role: 'ACTOR' },
      ],
    },
    {
      title: 'The Godfather',
      price: 119,
      releaseDate: new Date('1972-01-01'),
      runtime: 175,
      rating: 4.9,
      stock: 6,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY562_CR8,0,380,562_.jpg',
      description:
        'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      genres: ['Crime', 'Drama'],
      credits: [
        { name: 'Francis Ford Coppola', role: 'DIRECTOR' },
        { name: 'Marlon Brando', role: 'ACTOR' },
        { name: 'Al Pacino', role: 'ACTOR' },
        { name: 'James Caan', role: 'ACTOR' },
      ],
    },
    {
      title: 'Forrest Gump',
      price: 99,
      releaseDate: new Date('1994-01-01'),
      runtime: 142,
      rating: 4.6,
      stock: 11,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg',
      description:
        "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75.",
      genres: ['Drama', 'Romance'],
      credits: [
        { name: 'Robert Zemeckis', role: 'DIRECTOR' },
        { name: 'Tom Hanks', role: 'ACTOR' },
        { name: 'Robin Wright', role: 'ACTOR' },
        { name: 'Gary Sinise', role: 'ACTOR' },
      ],
    },
    {
      title: 'Gladiator',
      price: 139,
      releaseDate: new Date('2000-01-01'),
      runtime: 155,
      rating: 4.6,
      stock: 13,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1ZmJiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
      description:
        'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
      genres: ['Action', 'Adventure', 'Drama'],
      credits: [
        { name: 'Ridley Scott', role: 'DIRECTOR' },
        { name: 'Russell Crowe', role: 'ACTOR' },
        { name: 'Joaquin Phoenix', role: 'ACTOR' },
        { name: 'Connie Nielsen', role: 'ACTOR' },
      ],
    },
    {
      title: 'Avengers: Endgame',
      price: 199,
      releaseDate: new Date('2019-01-01'),
      runtime: 181,
      rating: 4.8,
      stock: 40,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_QL75_UX380_CR0,0,380,562_.jpg',
      description:
        'After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.',
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      credits: [
        { name: 'Anthony Russo', role: 'DIRECTOR' },
        { name: 'Joe Russo', role: 'DIRECTOR' },
        { name: 'Robert Downey Jr.', role: 'ACTOR' },
        { name: 'Chris Evans', role: 'ACTOR' },
        { name: 'Mark Ruffalo', role: 'ACTOR' },
      ],
    },
    {
      title: 'Jurassic Park',
      price: 89,
      releaseDate: new Date('1993-01-01'),
      runtime: 127,
      rating: 4.7,
      stock: 20,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_SX300.jpg',
      description:
        'An industrialist invites some experts to visit his theme park of cloned dinosaurs. After a power failure, the creatures run loose.',
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      credits: [
        { name: 'Steven Spielberg', role: 'DIRECTOR' },
        { name: 'Sam Neill', role: 'ACTOR' },
        { name: 'Laura Dern', role: 'ACTOR' },
        { name: 'Jeff Goldblum', role: 'ACTOR' },
      ],
    },
  ];

  // 3. Insert Movies, Persons, and Credits
  const createdMovies = [];

  // Pre-create all unique persons to avoid duplicates
  // Map over `credits` instead of `directors` and `cast`
  const allPersonNames = [
    ...new Set(movieData.flatMap((m) => m.credits.map((c) => c.name))),
  ];
  const personMap = new Map();

  for (const name of allPersonNames) {
    const person = await prisma.person.create({
      data: { name },
    });
    personMap.set(name, person.id);
  }

  for (const movie of movieData) {
    const created = await prisma.movie.create({
      data: {
        title: movie.title,
        price: movie.price,
        imageUrl: movie.imageUrl,
        description: movie.description,
        releaseDate: movie.releaseDate, // FIXED: Was creating an invalid Date object
        runtime: movie.runtime,
        rating: movie.rating,
        genres: {
          connectOrCreate: movie.genres.map((genreName) => ({
            where: { name: genreName },
            create: { name: genreName },
          })),
        },
      },
    });

    // Iterate over the combined credits array instead of splitting directors/actors
    for (const credit of movie.credits) {
      await prisma.movieCredit.create({
        data: {
          movieId: created.id,
          personId: personMap.get(credit.name),
          role: credit.role, // 'DIRECTOR' or 'ACTOR'
        },
      });
    }

    createdMovies.push(created);
  }

  // 4. Create Simulated Orders
  const userId = 'placeholder-user-id';

  // Verify we actually have movies before trying to use their IDs
  if (createdMovies.length >= 5) {
    await prisma.order.create({
      data: {
        userId,
        totalAmount: 762,
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
            {
              movieId: createdMovies[3].id,
              quantity: 1,
              priceAtPurchase: createdMovies[3].price,
            },
            {
              movieId: createdMovies[4].id,
              quantity: 1,
              priceAtPurchase: createdMovies[4].price,
            },
          ],
        },
      },
    });
  }

  console.log(
    `Successfully seeded ${createdMovies.length} movies with persons and credits!`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
