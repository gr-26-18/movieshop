import MovieCard from '@/components/MovieCard';
import { prisma } from '@/lib/prisma';

type LandingMovie = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  releaseDate: Date;
  description: string;
  genres: { id: string; name: string }[];
};

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;

  // 1. If searching, just get the filtered list
  if (query) {
    const searchResults = await prisma.movie.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
      },
      include: { genres: true },
    });
    return (
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Results for "{query}"</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {searchResults.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
    );
  }
  // Fetching the 4 categories required by the spec.
  // "Most Purchased" is ranked by summed quantity sold.
  const [mostPurchasedIds, mostRecent, oldest, cheapest] = await Promise.all([
    prisma.orderItem.groupBy({
      by: ['movieId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    prisma.movie.findMany({
      take: 5,
      orderBy: { releaseDate: 'desc' },
      include: { genres: true },
    }),
    prisma.movie.findMany({
      take: 5,
      orderBy: { releaseDate: 'asc' },
      include: { genres: true },
    }),
    prisma.movie.findMany({
      take: 5,
      orderBy: { price: 'asc' },
      include: { genres: true },
    }),
  ]);

  const mostPurchased = await getMostPurchasedMovies(mostPurchasedIds);

  return (
    <main className="container mx-auto py-10 space-y-12">
      <MovieSection
        title="Most Purchased"
        movies={mostPurchased}
        priority={true}
      />
      <MovieSection title="New Releases" movies={mostRecent} priority={true} />
      <MovieSection title="Classic Hits" movies={oldest} />
      <MovieSection title="Best Deals" movies={cheapest} />
    </main>
  );
}

async function getMostPurchasedMovies(
  rankedIds: { movieId: string; _sum: { quantity: number | null } }[],
): Promise<LandingMovie[]> {
  if (rankedIds.length === 0) return [];

  const ids = rankedIds.map((item) => item.movieId);
  const movies = await prisma.movie.findMany({
    where: { id: { in: ids } },
    include: { genres: true },
  });

  const movieById = new Map(movies.map((movie) => [movie.id, movie]));
  const orderedMovies: LandingMovie[] = [];

  for (const id of ids) {
    const movie = movieById.get(id);
    if (movie) {
      orderedMovies.push(movie);
    }
  }

  return orderedMovies;
}

// Simple wrapper for the sections
function MovieSection({
  title,
  movies,
  priority = false,
}: {
  title: string;
  movies: LandingMovie[];
  priority?: boolean;
}) {
  if (movies.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-sm text-muted-foreground">
          No movies available in this section yet.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            priority={priority && index < 5}
          />
        ))}
      </div>
    </section>
  );
}
