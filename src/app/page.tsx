import MovieCard from '@/components/MovieCard';
import { prisma } from '@/lib/prisma';

export default async function LandingPage() {
  // Fetching the 4 categories required by the spec
  const [mostPurchased, mostRecent, oldest, cheapest] = await Promise.all([
    prisma.movie.findMany({
      take: 5,
      orderBy: { orderItems: { _count: 'desc' } },
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
  ]);
  return (
    <main className="container mx-auto py-10 space-y-12">
      <MovieSection title="Most Purchased" movies={mostPurchased} priority={true} />
      <MovieSection title="New Releases" movies={mostRecent} priority={true} />
      <MovieSection title="Classic Hits" movies={oldest} />
      <MovieSection title="Best Deals" movies={cheapest} />
    </main>
  );
}

// Simple wrapper for the sections
function MovieSection({ title, movies, priority = false }: { title: string; movies: any[]; priority?: boolean }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} priority={priority && index < 5} />
        ))}
      </div>
    </section>
  );
}
