import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function createMovie(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const releaseDate = new Date(formData.get("releaseDate") as string);
  const imageUrl = formData.get("imageUrl") as string;

  const genresInput = formData.get("genres") as string;

  const genres = genresInput
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  await prisma.movie.create({
    data: {
      title,
      description,
      price,
      stock,
      releaseDate,
      imageUrl,
      genres: {
        connectOrCreate: genres.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  redirect("/admin/movies");
}

export default function AdminNewMoviePage() {

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create Movie</h2>
        <p className="text-sm text-muted-foreground">
          Add a new movie to the store.
        </p>
      </div>

      <form action={createMovie} className="space-y-3">
        <div>
          <label className="text-sm">Title</label>
          <input
            name="title"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Description</label>
          <input
            name="description"
            type="string"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Genres (comma separated)</label>
          <input
          name="genres"
          placeholder="Action, Drama, Comedy"
          className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Price (in cents)</label>
          <input
            name="price"
            type="number"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Release Date</label>
          <input
            name="releaseDate"
            type="number"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Stock</label>
          <input
            name="stock"
            type="number"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Run Time</label>
          <input
            name="runTime"
            type="string"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Image URL</label>
          <input
            name="imageUrl"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        
        <button
          type="submit"
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          Create Movie
        </button>
      </form>
    </section>
  );
};