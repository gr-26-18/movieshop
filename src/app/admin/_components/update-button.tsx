"use client";

export function UpdateButton() {
  return (
    <button
      type="submit"
      className="rounded-md border px-4 py-2 text-sm"
      onClick={(e) => {
        if (!confirm("Save changes to this movie?")) {
          e.preventDefault();
        }
      }}
    >
      Update Movie
    </button>
  );
}