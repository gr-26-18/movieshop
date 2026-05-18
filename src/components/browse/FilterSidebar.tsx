'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Label } from '@/components/ui/label';

export type FilterOption = {
  id: string;
  name: string;
};

type Props = {
  genres: FilterOption[];
  directors: FilterOption[];
  actors: FilterOption[];
};

export default function FilterSidebar({ genres, directors, actors }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Create a new URLSearchParams to manipulate the current query parameters
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    router.push(`/browse?${createQueryString(key, value)}`);
  };

  const currentGenre = searchParams.get('genre') || '';
  const currentDirector = searchParams.get('director') || '';
  const currentActor = searchParams.get('actor') || '';

  return (
    <div className="w-full bg-white p-6 rounded-2xl border shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Filters</h2>
      </div>

      <div className="space-y-4">
        {/* Genre Filter */}
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <select
            id="genre"
            value={currentGenre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-sm"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Director Filter */}
        <div className="space-y-2">
          <Label htmlFor="director">Director</Label>
          <select
            id="director"
            value={currentDirector}
            onChange={(e) => handleFilterChange('director', e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-sm"
          >
            <option value="">All Directors</option>
            {directors.map((dir) => (
              <option key={dir.id} value={dir.id}>
                {dir.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actor Filter */}
        <div className="space-y-2">
          <Label htmlFor="actor">Actor</Label>
          <select
            id="actor"
            value={currentActor}
            onChange={(e) => handleFilterChange('actor', e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-sm"
          >
            <option value="">All Actors</option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(currentGenre || currentDirector || currentActor) && (
        <button
          onClick={() => router.push('/browse')}
          className="w-full text-sm text-blue-600 hover:text-blue-800 hover:underline pt-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
