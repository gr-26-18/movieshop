import MovieCard from '@/components/MovieCard';
import { prisma } from '@/lib/prisma';

export default async function LandingPage() {
  // Fetching the 4 categories required by the spec
  const [mostPurchased, mostRecent, oldest, cheapest] = await Promise.all([
    prisma.movie.findMany({
      take: 5,
      orderBy: { orderItems: { _count: 'desc' } },
    }),
    prisma.movie.findMany({
      take: 5,
      orderBy: { releaseDate: 'desc' },
    }),
    prisma.movie.findMany({
      take: 5,
      orderBy: { releaseDate: 'asc' },
    }),
    prisma.movie.findMany({
      take: 5,
      orderBy: { price: 'asc' },
    }),
  ]);
  return (
    <main className="container mx-auto py-10 space-y-12">
      <h1 className="text-4xl font-bold text-center">MovieShop</h1>

      <MovieSection title="Most Purchased" movies={mostPurchased} />
      <MovieSection title="New Releases" movies={mostRecent} />
      <MovieSection title="Classic Hits" movies={oldest} />
      <MovieSection title="Best Deals" movies={cheapest} />
    </main>
  );
}

// Simple wrapper for the sections
function MovieSection({ title, movies }: { title: string; movies: any[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
