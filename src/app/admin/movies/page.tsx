import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminMoviesPage() {
  const movies = await prisma.movie.findMany({
    orderBy: { updatedAt: "desc" },
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
            Basic admin movie list scaffold.
          </p>
        </div>
        <Link
          href="/admin/movies/new"
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          New Movie
        </Link>
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
                <td className="px-4 py-3">${(movie.price / 100).toFixed(2)}</td>
                <td className="px-4 py-3">{movie.stock}</td>
                <td className="px-4 py-3">
                  {movie.releaseDate.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">{movie.updatedAt.toLocaleDateString()}</td>
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
                  No movies available yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
