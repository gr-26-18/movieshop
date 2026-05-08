"use client";

import { useState } from "react";

type Genre = {
  id: string;
  name: string;
};

export function GenrePicker({ 
  genres,
  initialSelected = [],
}: { 
  genres: Genre[];
  initialSelected?: Genre[];
}) {
  const [selected, setSelected] = useState<Genre[]>(initialSelected);

  function addGenre(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    if (!id) return;
    const genre = genres.find((g) => g.id === id);
    if (!genre) return;
    if (selected.some((s) => s.id === id)) return;
    setSelected([...selected, genre]);
    e.target.value = "";
  }

  function removeGenre(id: string) {
    setSelected(selected.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-2">
      <select
        onChange={addGenre}
        className="w-full rounded-md border px-3 py-2 text-sm"
        defaultValue=""
      >
        <option value="">-- Select Genre --</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((genre) => (
            <span
              key={genre.id}
              className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
            >
              {genre.name}
              <button
                type="button"
                onClick={() => removeGenre(genre.id)}
                className="ml-1 text-muted-foreground hover:text-red-600"
              >
                ×
              </button>
              <input type="hidden" name="genreIds" value={genre.id} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}