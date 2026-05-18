import { prisma } from '@/lib/prisma';
import MovieCard from '@/components/MovieCard';
import FilterSidebar from '@/components/browse/FilterSidebar';

export const dynamic = 'force-dynamic';

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { genre, director, actor, q } = await searchParams;

  // Fetch unique genres, directors, and actors
  const [genres, directors, actors] = await Promise.all([
    prisma.genre.findMany({ orderBy: { name: 'asc' } }),
    prisma.person.findMany({
      where: { credits: { some: { role: 'DIRECTOR' } } },
      orderBy: { name: 'asc' },
    }),
    prisma.person.findMany({
      where: { credits: { some: { role: 'ACTOR' } } },
      orderBy: { name: 'asc' },
    }),
  ]);

  // Build the where clause based on filters
  const whereClause: any = {};
  
  if (q && q.trim() !== '') {
    whereClause.title = { contains: q.trim(), mode: 'insensitive' };
  }
  
  if (genre) {
    whereClause.genres = { some: { id: genre } };
  }

  // To combine multiple credits conditions, we use AND so both apply to the same movie
  const andConditions: any[] = [];
  
  if (director) {
    andConditions.push({
      credits: { some: { personId: director, role: 'DIRECTOR' } }
    });
  }
  
  if (actor) {
    andConditions.push({
      credits: { some: { personId: actor, role: 'ACTOR' } }
    });
  }

  if (andConditions.length > 0) {
    whereClause.AND = andConditions;
  }

  const movies = await prisma.movie.findMany({
    where: whereClause,
    include: { genres: true },
    orderBy: { releaseDate: 'desc' },
  });

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Browse Movies</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-8 items-start">
        {/* Sidebar */}
        <div className="sticky top-24">
          <FilterSidebar genres={genres} directors={directors} actors={actors} />
        </div>

        {/* Results */}
        <div>
          {movies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xl font-semibold text-slate-700">
                No movies found
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Try adjusting or clearing your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
