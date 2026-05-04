import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

type MoviesSearchParams = {
  q?: string;
  stock?: 'all' | 'in' | 'out';
};

function toDateLabel(value: Date): string {
  return value.toLocaleDateString();
}

export default async function AdminMoviesPage({
  searchParams,
}: {
  searchParams: Promise<MoviesSearchParams>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const stockFilter = params.stock ?? 'all';

  const whereClause = {
    ...(query
      ? {
          title: {
            contains: query,
            mode: 'insensitive' as const,
          },
        }
      : {}),
    ...(stockFilter === 'in'
      ? { stock: { gt: 0 } }
      : stockFilter === 'out'
        ? { stock: 0 }
        : {}),
  };

  const movies = await prisma.movie.findMany({
    where: whereClause,
    orderBy: { updatedAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      stock: true,
      price: true,
      releaseDate: true,
      updatedAt: true,
    },
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Movies</h2>
          <p className="text-sm text-muted-foreground">
            Search, filter, and review movie inventory.
          </p>
        </div>
        <Link
          href="/admin/movies/new"
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          New Movie
        </Link>
      </div>

      <form className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <Input
          defaultValue={query}
          name="q"
          placeholder="Search by movie title..."
        />
        <select
          defaultValue={stockFilter}
          name="stock"
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All stock states</option>
          <option value="in">In stock only</option>
          <option value="out">Out of stock only</option>
        </select>
        <button
          className="h-9 rounded-md border px-3 text-sm hover:bg-muted"
          type="submit"
        >
          Apply
        </button>
      </form>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Showing {movies.length} result(s)</span>
        {query ? <Badge variant="outline">query: {query}</Badge> : null}
        {stockFilter !== 'all' ? (
          <Badge variant="outline">stock: {stockFilter}</Badge>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y">
          <thead className="bg-muted/40 text-left text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Release Date</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td className="px-4 py-3">{movie.title}</td>
                <td className="px-4 py-3">{formatPrice(movie.price)}</td>
                <td className="px-4 py-3">
                  {movie.stock > 0 ? (
                    <Badge variant="outline">{movie.stock}</Badge>
                  ) : (
                    <Badge variant="outline">Out</Badge>
                  )}
                </td>
                <td className="px-4 py-3">{toDateLabel(movie.releaseDate)}</td>
                <td className="px-4 py-3">{toDateLabel(movie.updatedAt)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/movies/${movie.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {movies.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted-foreground" colSpan={6}>
                  No movies match your current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
