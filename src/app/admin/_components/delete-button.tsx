"use client";

export function DeleteButton() {
  return (
    <button
      type="submit"
      className="text-red-600 hover:underline"
      onClick={(e) => {
        if (!confirm("Are you sure you want to delete this movie?")) {
          e.preventDefault();
        }
      }}
    >
      Delete
    </button>
  );
}