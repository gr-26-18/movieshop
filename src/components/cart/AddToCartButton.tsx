'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

export default function AddToCartButton({ movieId }: { movieId: string }) {
  const { addToCart } = useCart();

  return (
    <Button 
      size="lg" 
      onClick={() => addToCart(movieId)}
      className="w-full sm:w-auto text-base font-bold px-8 h-14 rounded-xl gap-2 shadow-lg hover:scale-105 transition-transform"
    >
      <ShoppingCart className="w-5 h-5" />
      Add to Cart
    </Button>
  );
}
