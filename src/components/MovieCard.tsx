import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
    releaseDate: Date;
    description: string;
  };
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
      {/* 1. Image Container */}
      <CardHeader className="p-0 relative h-80 w-full overflow-hidden">
        <Image
          src={movie.imageUrl || '/placeholder-movie.jpg'}
          alt={movie.title}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true} // Add this to fix the LCP warning for top-row images
        />
        <Badge className="absolute top-2 right-2 bg-primary text-white">
          ${movie.price.toFixed(2)}
        </Badge>
      </CardHeader>
      {/* 2. Movie Info  */}
      <CardContent className="flex-1 p-4">
        <CardTitle className="text-lg line-clamp-1 mb-1">
          {movie.title}
        </CardTitle>
        <p className="text-xs text-muted-foreground mb-2">
          Released: {new Date(movie.releaseDate).getFullYear()}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {movie.description}
        </p>
      </CardContent>

      {/* 3. Action Button [cite: 42, 82] */}
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="outline">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
