import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import { UpdateButton } from "@/app/admin/_components/update-button";
import { GenrePicker } from "@/app/admin/_components/genre-picker";
import { DirectorPicker } from "@/app/admin/_components/director-picker";
import { ActorPicker } from "@/app/admin/_components/actor-picker";

async function updateMovie(id: string, formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const runtime = formData.get("runtime") ? Number(formData.get("runtime")) : null;
  const releaseDate = new Date(formData.get("releaseDate") as string);

  const genreIds = formData.getAll("genreIds") as string[];
  const directorIds = formData.getAll("directorId") as string[];
  const actorIds = formData.getAll("actorIds") as string[];

  await prisma.$transaction(async (tx) => {
    await tx.movie.update({
      where: { id },
      data: {
        title,
        description,
        price,
        stock,
        runtime,
        releaseDate,
        genres: {
          set: genreIds.map((id) => ({ id })),
        },
      },
    });

    await tx.movieCredit.deleteMany({ where: { movieId: id } });

    for (const directorId of directorIds) {
      await tx.movieCredit.create({
        data: { movieId: id, personId: directorId, role: 'DIRECTOR' },
      });
    }

    for (const actorId of actorIds) {
      await tx.movieCredit.create({
        data: { movieId: id, personId: actorId, role: 'ACTOR' },
      });
    }
  });

  redirect("/admin/movies");
}

async function findMovieById(id: string) {
  try {
    return await prisma.movie.findUnique({
      where: { id },
      include: { genres: true },
    });
  } catch (error) {
    // Retry once for transient "server closed the connection" errors.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P1017"
    ) {
      await prisma.$disconnect();
      await prisma.$connect();
      return prisma.movie.findUnique({
        where: { id },
        include: { genres: true },
      });
    }
    throw error;
  }
}

export default async function AdminEditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [movie, allGenres, allPeople] = await Promise.all([
    prisma.movie.findUnique({
      where: { id },
      include: {
        genres: true,
        credits: { include: { person: true } },
      },
    }),
    prisma.genre.findMany({ orderBy: { name: 'asc' } }),
    prisma.person.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  const currentDirectors = movie.credits
    .filter((c) => c.role === 'DIRECTOR')
    .map((c) => c.person);

  const currentActors = movie.credits
    .filter((c) => c.role === 'ACTOR')
    .map((c) => c.person);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Edit Movie</h2>

      <form action={updateMovie.bind(null, id)} className="space-y-3">
        <div>
          <label className="text-sm">Title</label>
          <input
            name="title"
            defaultValue={movie.title}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Description</label>
          <input
            name="description"
            defaultValue={movie.description ?? ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Genres</label>
          <GenrePicker genres={allGenres} initialSelected={movie.genres} />
        </div>

        <div>
          <label className="text-sm">Director</label>
          <DirectorPicker people={allPeople} initialSelected={currentDirectors} />
        </div>

        <div>
          <label className="text-sm">Actors</label>
          <ActorPicker people={allPeople} initialSelected={currentActors} />
        </div>

        <div>
          <label className="text-sm">Price</label>
          <input
            name="price"
            type="number"
            defaultValue={movie.price}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Stock</label>
          <input
            name="stock"
            type="number"
            defaultValue={movie.stock}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Runtime (minutes)</label>
          <input
            name="runtime"
            type="number"
            defaultValue={movie.runtime ?? ''}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Release Date</label>
          <input
            name="releaseDate"
            type="date"
            defaultValue={movie.releaseDate.toISOString().split("T")[0]}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <UpdateButton label="movie" />
          <a href="/admin/movies"
            className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
            Cancel
          </a>
        </div>
      </form>
    </section>
  );
}