import Link from "next/link";
import { createGenre } from "@/actions/genres";

export default function NewGenrePage() {
  return (
    <section className="space-y-4 max-w-lg">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">New Genre</h2>
        <p className="text-sm text-muted-foreground">
          Create a new movie genre.
        </p>
      </div>

      <form action={createGenre} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Action"
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
            placeholder="Optional description..."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Create Genre
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