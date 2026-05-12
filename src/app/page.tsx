import MovieCard from '@/components/MovieCard';
import { prisma } from '@/lib/prisma';
import { runPrismaWithFallback } from '@/lib/prisma-utils';

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
  const [mostPurchased, mostRecent, oldest, cheapest] =
    await runPrismaWithFallback(
      () =>
        Promise.all([
          prisma.movie.findMany({
            take: 5,
            orderBy: {
              orderItems: {
                _count: 'desc'
              }
            },
            include: { genres: true },
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
        LandingMovie[],
        LandingMovie[],
        LandingMovie[],
        LandingMovie[],
      ],
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


