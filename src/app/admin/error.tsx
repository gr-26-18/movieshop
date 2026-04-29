"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="space-y-4 rounded-lg border bg-card p-6">
      <h2 className="text-xl font-semibold">Admin page failed to load</h2>
      <p className="text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred while loading admin data."}
      </p>
      <button
        className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </section>
  );
}
