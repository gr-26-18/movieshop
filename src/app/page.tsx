import MovieCard from '@/components/MovieCard';
import { Prisma } from '@/generated/prisma/client';
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
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  // 1. If searching, just get the filtered list
  if (q && q.trim() !== '') {
    const searchResults = await runPrismaWithFallback(
      () =>
        prisma.movie.findMany({
          where: {
            title: { contains: q.trim(), mode: 'insensitive' },
          },
          include: { genres: true },
        }),
      [] as LandingMovie[],
    );

    return (
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Results for "{q}"</h1>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              Oops! No movies found matching "{q}".
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try searching for something else!
            </p>
          </div>
        )}
      </main>
    );
  }
  // Fetching the 4 categories required by the spec.
  // "Most Purchased" is ranked by summed quantity sold.
  const [mostPurchasedIds, mostRecent, oldest, cheapest] =
    await runPrismaWithFallback(
      () =>
        Promise.all([
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
        ]),
      [[], [], [], []] as [
        { movieId: string; _sum: { quantity: number | null } }[],
        LandingMovie[],
        LandingMovie[],
        LandingMovie[],
      ],
    );

  const mostPurchased = await runPrismaWithFallback(
    () => getMostPurchasedMovies(mostPurchasedIds),
    [] as LandingMovie[],
  );

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

function isRetryablePrismaError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P1017' || error.code === 'ECONNREFUSED';
  }

  return error instanceof Prisma.PrismaClientInitializationError;
}

async function runPrismaWithFallback<T>(
  operation: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isRetryablePrismaError(error)) {
      throw error;
    }

    try {
      await prisma.$disconnect();
    } catch {
      // Ignore disconnect failures and continue with reconnect attempt.
    }

    try {
      await prisma.$connect();
      return await operation();
    } catch {
      return fallback;
    }
  }
}
