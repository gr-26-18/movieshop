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
      year: 2023,
      runtime: 140,
      rating: 4.8,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg',
      description:
        'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
      genres: ['Animation', 'Action', 'Adventure'],
      directors: ['Joaquim Dos Santos', 'Kemp Powers', 'Justin K. Thompson'],
      cast: ['Shameik Moore', 'Hailee Steinfeld', 'Brian Tyree Henry'],
    },
    {
      title: 'The Batman',
      price: 155,
      year: 2022,
      runtime: 176,
      rating: 4.5,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_SX300.jpg',
      description:
        "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
      genres: ['Action', 'Crime', 'Drama'],
      directors: ['Matt Reeves'],
      cast: ['Robert Pattinson', 'Zoë Kravitz', 'Jeffrey Wright'],
    },
    {
      title: 'Everything Everywhere All at Once',
      price: 140,
      year: 2022,
      runtime: 139,
      rating: 4.7,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg',
      description:
        'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes.',
      genres: ['Action', 'Adventure', 'Comedy'],
      directors: ['Daniel Kwan', 'Daniel Scheinert'],
      cast: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan'],
    },
    {
      title: 'Dune',
      price: 169,
      year: 2021,
      runtime: 155,
      rating: 4.6,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNWIyNmU5MGYtZDZmNi00ZjAwLWJlYjgtZTc0ZGIxMDE4ZGYwXkEyXkFqcGc@._V1_QL75_UY562_CR1,0,380,562_.jpg',
      description:
        "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir is troubled by visions of a dark future.",
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      directors: ['Denis Villeneuve'],
      cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Zendaya'],
    },
    {
      title: 'Fight Club',
      price: 99,
      year: 1999,
      runtime: 139,
      rating: 4.9,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
      description:
        'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
      genres: ['Drama'],
      directors: ['David Fincher'],
      cast: ['Brad Pitt', 'Edward Norton', 'Meat Loaf'],
    },
    {
      title: 'Spirited Away',
      price: 180,
      year: 2001,
      runtime: 125,
      rating: 4.8,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNTEyNmEwOWUtYzkyOC00ZTQ4LTllZmUtMjk0Y2YwOGUzYjRiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
      description:
        "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
      genres: ['Animation', 'Adventure', 'Family'],
      directors: ['Hayao Miyazaki'],
      cast: ['Daveigh Chase', 'Suzanne Pleshette', 'Miyu Irino'],
    },
    {
      title: 'Goodfellas',
      price: 119,
      year: 1990,
      runtime: 145,
      rating: 4.8,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BN2E5NzI2ZGMtY2VjNi00YTRjLWI1MDUtZGY5OWU1MWJjZjRjXkEyXkFqcGc@._V1_QL75_UX380_CR0,3,380,562_.jpg',
      description:
        'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.',
      genres: ['Biography', 'Crime', 'Drama'],
      directors: ['Martin Scorsese'],
      cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'],
    },
    {
      title: 'Alien',
      price: 89,
      year: 1979,
      runtime: 117,
      rating: 4.7,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BN2NhMDk2MmEtZDQzOC00MmY5LThhYzAtMDdjZGFjOGZjMjdjXkEyXkFqcGc@._V1_QL75_UX380_CR0,6,380,562_.jpg',
      description:
        'After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form.',
      genres: ['Horror', 'Sci-Fi'],
      directors: ['Ridley Scott'],
      cast: ['Sigourney Weaver', 'Tom Skerritt', 'John Hurt'],
    },
    {
      title: 'Inception',
      price: 149,
      year: 2010,
      runtime: 148,
      rating: 4.8,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      description: 'A thief who steals corporate secrets...',
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      directors: ['Christopher Nolan'],
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    },
    {
      title: 'The Dark Knight',
      price: 199,
      year: 2008,
      runtime: 152,
      rating: 4.9,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
      description: 'Batman faces the Joker...',
      genres: ['Action', 'Crime', 'Drama'],
      directors: ['Christopher Nolan'],
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    },
    {
      title: 'Interstellar',
      price: 129,
      year: 2014,
      runtime: 169,
      rating: 4.7,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      description: 'Explorers travel through a wormhole...',
      genres: ['Adventure', 'Drama', 'Sci-Fi'],
      directors: ['Christopher Nolan'],
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    },
    {
      title: 'The Matrix',
      price: 109,
      year: 1999,
      runtime: 136,
      rating: 4.8,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
      description:
        'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
      genres: ['Action', 'Sci-Fi'],
      directors: ['Lana Wachowski', 'Lilly Wachowski'],
      cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    },
    {
      title: 'Pulp Fiction',
      price: 129,
      year: 1994,
      runtime: 154,
      rating: 4.9,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_QL75_UY562_CR3,0,380,562_.jpg',
      description:
        'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      genres: ['Crime', 'Drama'],
      directors: ['Quentin Tarantino'],
      cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    },
    {
      title: 'Parasite',
      price: 145,
      year: 2019,
      runtime: 132,
      rating: 4.7,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_SX300.jpg',
      description:
        'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
      genres: ['Drama', 'Thriller'],
      directors: ['Bong Joon Ho'],
      cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      price: 150,
      year: 2001,
      runtime: 178,
      rating: 4.8,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_SX300.jpg',
      description:
        'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
      genres: ['Action', 'Adventure', 'Drama'],
      directors: ['Peter Jackson'],
      cast: ['Elijah Wood', 'Ian McKellen', 'Orlando Bloom'],
    },
    {
      title: 'The Godfather',
      price: 119,
      year: 1972,
      runtime: 175,
      rating: 4.9,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY562_CR8,0,380,562_.jpg',
      description:
        'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      genres: ['Crime', 'Drama'],
      directors: ['Francis Ford Coppola'],
      cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    },
    {
      title: 'Forrest Gump',
      price: 99,
      year: 1994,
      runtime: 142,
      rating: 4.6,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg',
      description:
        "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.",
      genres: ['Drama', 'Romance'],
      directors: ['Robert Zemeckis'],
      cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
    },
    {
      title: 'Gladiator',
      price: 139,
      year: 2000,
      runtime: 155,
      rating: 4.6,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1ZmJiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
      description:
        'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
      genres: ['Action', 'Adventure', 'Drama'],
      directors: ['Ridley Scott'],
      cast: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'],
    },
    {
      title: 'Avengers: Endgame',
      price: 199,
      year: 2019,
      runtime: 181,
      rating: 4.8,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_QL75_UX380_CR0,0,380,562_.jpg',
      description:
        "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      directors: ['Anthony Russo', 'Joe Russo'],
      cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
    },
    {
      title: 'Jurassic Park',
      price: 89,
      year: 1993,
      runtime: 127,
      rating: 4.7,
      imageUrl:
        'https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_SX300.jpg',
      description:
        "An industrialist invites some experts to visit his theme park of cloned dinosaurs. After a power failure, the creatures run loose, putting everyone's lives, including his grandchildren's, in danger.",
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      directors: ['Steven Spielberg'],
      cast: ['Sam Neill', 'Laura Dern', 'Jeff Goldblum'],
    },
  ];

  // 3. Insert Movies, Persons, and Credits
  const createdMovies = [];
  
  for (const movie of movieData) {
    // Collect all person names to ensure they exist
    const personNames = [...new Set([...movie.directors, ...movie.cast])];
    
    // Ensure all persons exist
    for (const name of personNames) {
      // Prisma Person model doesn't have @unique on name. We'll manually check and create to avoid duplicates.
    }
  }

  // Pre-create all unique persons to avoid duplicates
  const allPersonNames = [...new Set(movieData.flatMap((m) => [...m.directors, ...m.cast]))];
  const personMap = new Map();
  
  for (const name of allPersonNames) {
    const person = await prisma.person.create({
      data: { name }
    });
    personMap.set(name, person.id);
  }

  for (const movie of movieData) {
    const created = await prisma.movie.create({
      data: {
        title: movie.title,
        price: movie.price, // Removed Math.round(movie.price * 100)
        imageUrl: movie.imageUrl,
        description: movie.description,
        releaseDate: new Date(`${movie.year}-01-01`),
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

    // Create credits for directors
    for (const directorName of movie.directors) {
      await prisma.movieCredit.create({
        data: {
          movieId: created.id,
          personId: personMap.get(directorName),
          role: 'DIRECTOR',
        }
      });
    }

    // Create credits for actors
    for (const actorName of movie.cast) {
      await prisma.movieCredit.create({
        data: {
          movieId: created.id,
          personId: personMap.get(actorName),
          role: 'ACTOR',
        }
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
        totalAmount: 762, // Updated to match the new integer prices of first 5 movies (199+155+140+169+99)
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

  console.log(`Successfully seeded ${createdMovies.length} movies with persons and credits!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
