import { prisma } from "@/lib/prisma";
import { createMovie } from "@/actions/movies";
import { ActorPicker } from "../../_components/actor-picker";
import { GenrePicker } from "../../_components/genre-picker";
import { DirectorPicker } from "../../_components/director-picker"


export default async function AdminNewMoviePage() {
  const [genres, people] = await Promise.all([
    prisma.genre.findMany({ orderBy: { name: 'asc' } }),
    prisma.person.findMany({ orderBy: { name: 'asc' } }),
  ]);

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
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Genres</label>
          <GenrePicker genres={genres} />
        </div>

        <div>
          <label className="text-sm">Director</label>
          <DirectorPicker people={people} />
        </div>

        <div>
          <label className="text-sm">Actors</label>
          <ActorPicker people={people} />
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
            type="date"
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
          <label className="text-sm">Runtime (minutes)</label>
          <input
            name="runtime"
            type="number"
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
}