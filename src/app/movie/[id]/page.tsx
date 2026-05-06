import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Calendar, Star, ShoppingCart } from 'lucide-react';

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      genres: true,
      credits: {
        include: { person: true },
      },
    },
  });

  if (!movie) {
    notFound();
  }

  // Get total purchases
  const purchasesAgg = await prisma.orderItem.aggregate({
    where: { movieId: id },
    _sum: { quantity: true },
  });
  const totalPurchases = purchasesAgg._sum.quantity || 0;

  const directors = movie.credits
    .filter((c) => c.role === 'DIRECTOR')
    .map((c) => c.person.name)
    .join(', ');

  const cast = movie.credits
    .filter((c) => c.role === 'ACTOR')
    .map((c) => c.person.name)
    .join(', ');

  const priceLabel = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(movie.price);
  
  // Format release date e.g., March 24, 1972
  const releaseDateFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(movie.releaseDate));

  return (
    <main className="container mx-auto py-10 px-4">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
        {/* Left Column: Poster */}
        <div className="relative w-full aspect-[2/3] max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl bg-slate-200">
          <Image
            src={movie.imageUrl || '/placeholder-movie.jpg'}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col">
          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre) => (
              <Badge key={genre.id} variant="secondary" className="bg-muted hover:bg-muted text-muted-foreground font-semibold px-3 py-1 text-xs rounded-full shadow-none">
                {genre.name}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            {movie.title}
          </h1>

          {/* Meta Info (Rating/Purchases, Runtime, Date) */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 font-medium">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-foreground font-bold">{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
              <span>({totalPurchases} purchases)</span>
            </div>
            
            {movie.runtime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{movie.runtime} min</span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{releaseDateFormatted}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-foreground/80 leading-relaxed mb-10 max-w-3xl">
            {movie.description}
          </p>

          <hr className="border-border mb-8" />

          {/* Credits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-bold mb-2">Director</h3>
              <p className="text-muted-foreground">{directors || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Cast</h3>
              <p className="text-muted-foreground">{cast || 'N/A'}</p>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-auto">
            <div>
              <p className="text-sm text-muted-foreground font-semibold mb-1">Buy Digital Copy</p>
              <p className="text-3xl font-extrabold">{priceLabel}</p>
            </div>
            
            <Button size="lg" className="w-full sm:w-auto text-base font-bold px-8 h-14 rounded-xl gap-2 shadow-lg hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
