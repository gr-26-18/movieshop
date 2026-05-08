"use client";

export function DeleteButton({ label = "item" } : {label?: string}) {
  return (
    <button
      type="submit"
      className="text-red-600 hover:underline"
      onClick={(e) => {
        if (!confirm(`Are you sure you want to delete this ${label}?`)) {
          e.preventDefault();
        }
      }}
    >
      Delete
    </button>
  );
}