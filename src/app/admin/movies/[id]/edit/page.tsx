import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AdminEditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="space-y-2">
      <Link
        href="/admin/movies"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Movies
      </Link>
      <h2 className="text-2xl font-bold tracking-tight">Edit Movie</h2>
      <p className="text-sm text-muted-foreground">
        Edit Movie form is pending (owned by Movie CRUD task). Route and movie
        ID wiring are verified for{' '}
        <span className="font-mono">{id}</span>.
      </p>
    </section>
  );
}
