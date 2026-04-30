export default async function AdminEditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="space-y-2">
      <h2 className="text-2xl font-bold tracking-tight">Edit Movie</h2>
      <p className="text-sm text-muted-foreground">
        Editing flow for movie <span className="font-mono">{id}</span> is planned
        for the movie-management phase.
      </p>
    </section>
  );
}
