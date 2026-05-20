import Link from "next/link";
import { getGenres } from "@/actions/genres";
import { deleteGenre } from "@/actions/genres";
import { DeleteButton } from "@/app/admin/_components/delete-button";

export default async function AdminGenresPage() {
  const genres = await getGenres();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Genres</h2>
          <p className="text-sm text-muted-foreground">
            Manage movie genres.
          </p>
        </div>
        <Link
          href="/admin/genres/new"
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          New Genre
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y">
          <thead className="bg-muted/40 text-left text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Movies</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {genres.map((genre) => (
              <tr key={genre.id}>
                <td className="px-4 py-3 font-medium">{genre.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {genre.description ?? "—"}
                </td>
                <td className="px-4 py-3">{genre._count.movies}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/genres/${genre.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteGenre.bind(null, genre.id)}>
                      <DeleteButton />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {genres.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-muted-foreground"
                  colSpan={4}
                >
                  No genres yet. Create your first one!
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}