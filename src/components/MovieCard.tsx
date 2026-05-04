import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
    releaseDate: Date;
    description: string;
    genres?: { id: string; name: string }[];
  };
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="flex flex-col group cursor-pointer p-3 -m-3 rounded-2xl transition-all duration-300 hover:bg-slate-50 hover:shadow-xl hover:scale-105"
    >
      <div className="relative w-full h-[420px] sm:h-[360px] lg:h-[300px] rounded-xl overflow-hidden mb-4 bg-slate-200">
        <Image
          src={movie.imageUrl || '/placeholder-movie.jpg'}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          priority={priority}
        />
      </div>

      {/* Info Container */}
      <div className="flex flex-col flex-1 px-1">
        {/* Title & Price Row */}
        <div className="flex justify-between items-start mb-1.5 gap-2">
          <h3 className="font-bold text-base leading-tight line-clamp-1 flex-1">
            {movie.title}
          </h3>
          <span className="font-bold text-sm shrink-0">
            {formatPrice(movie.price)}
          </span>
        </div>

        {/* Year Row */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-muted-foreground font-medium">
            {new Date(movie.releaseDate).getFullYear()}
          </span>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {movie.genres?.map((genre) => (
            <Badge
              key={genre.id}
              variant="secondary"
              className="text-[10px] px-2 py-0 rounded-md font-semibold bg-muted hover:bg-muted text-muted-foreground shadow-none"
            >
              {genre.name}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
