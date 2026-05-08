"use client";

import { useState } from "react";

type Person = {
  id: string;
  name: string;
};

export function ActorPicker({ 
  people,
  initialSelected = [],
}: { 
  people: Person[];
  initialSelected?: Person[];
}) {
  const [selected, setSelected] = useState<Person[]>(initialSelected);

  function addActor(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    if (!id) return;
    const person = people.find((p) => p.id === id);
    if (!person) return;
    if (selected.some((s) => s.id === id)) return;
    setSelected([...selected, person]);
    e.target.value = "";
  }

  function removeActor(id: string) {
    setSelected(selected.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-2">
      <select
        onChange={addActor}
        className="w-full rounded-md border px-3 py-2 text-sm"
        defaultValue=""
      >
        <option value="">-- Select Actor --</option>
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((person) => (
            <span
              key={person.id}
              className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
            >
              {person.name}
              <button
                type="button"
                onClick={() => removeActor(person.id)}
                className="ml-1 text-muted-foreground hover:text-red-600"
              >
                ×
              </button>
              <input type="hidden" name="actorIds" value={person.id} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}