import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import { UpdateButton } from "@/app/admin/_components/update-button";

async function updateMovie(id: string, formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const releaseDate = new Date(formData.get("releaseDate") as string);

  const genreIds = formData.getAll('genreIds') as string[];

  await prisma.movie.update({
    where: { id },
    data: {
      title,
      description,
      price,
      stock,
      releaseDate,
      genres: {
        set: genreIds.map((id) => ({ id })),
      },
    },
  });

  redirect("/admin/movies");
}

async function deleteMovie(id: string) {
  "use server";

  await prisma.movie.delete({
    where: { id },
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

  const [movie, allGenres] = await Promise.all([
    findMovieById(id),
    prisma.genre.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!movie) {
    return <div>Movie not found</div>;
  }

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
          <label className="text-sm">Release Date</label>
          <input
            name="releaseDate"
            type="date"
            defaultValue={movie.releaseDate.toISOString().split("T")[0]}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Genres</label>
          <div className="flex flex-wrap gap-3 rounded-md border px-3 py-2">
            {allGenres.map((genre) => (
              <label key={genre.id} className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  name="genreIds"
                  value={genre.id}
                  defaultChecked={movie.genres.some((g) => g.id === genre.id)}
                />
                {genre.name}
              </label>
            ))}
          </div>
        </div>
        <UpdateButton />
      </form>
    </section>
  );
}