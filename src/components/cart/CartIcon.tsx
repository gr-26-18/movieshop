'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-indigo-600 hover:text-indigo-700 rounded-full p-2"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
            {totalItems}
          </span>
        )}
        <span className="sr-only">Shopping Cart</span>
      </Button>
    </Link>
  );
}
