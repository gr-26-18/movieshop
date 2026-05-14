"use client";

export function UpdateButton({ 
  label = "item",
  buttonText = "Save Changes"
}: { 
  label?: string;
  buttonText?: string;
}) {
  return (
    <button
      type="submit"
      className="rounded-md border px-4 py-2 text-sm"
      onClick={(e) => {
        if (!confirm(`Save changes to this ${label}?`)) {
          e.preventDefault();
        }
      }}
    >
      {buttonText}
    </button>
  );
}