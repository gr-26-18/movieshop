import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateGenre } from "@/actions/genres";

export default async function EditGenrePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const genre = await prisma.genre.findUnique({
    where: { id },
  });

  if (!genre) {
    notFound();
  }

  const action = updateGenre.bind(null, id);

  return (
    <section className="space-y-4 max-w-lg">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Genre</h2>
        <p className="text-sm text-muted-foreground">
          Update genre information.
        </p>
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={genre.name}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={genre.description ?? ""}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </button>
          <Link
            href="/admin/genres"
            className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}