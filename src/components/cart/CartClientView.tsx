'use client';

// Updated 2026-05-11 — next/image `sizes` + `priority` on first row (cart LCP / console hints).

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

type CartItemDetails = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

export default function CartClientView({ initialItems }: { initialItems: CartItemDetails[] }) {
  const { items: contextItems, updateQuantity, removeFromCart, clearCart } = useCart();
  
  // We need to keep the local UI state in sync with the context items. 
  // initialItems contains the full movie details fetched from the server.
  // contextItems contains the latest { id, quantity } from the client context.
  
  const displayItems = initialItems.map(item => {
    const ctxItem = contextItems.find(c => c.id === item.id);
    return {
      ...item,
      quantity: ctxItem ? ctxItem.quantity : 0 // If not in context, it's 0 (removed)
    };
  }).filter(item => item.quantity > 0);

  const subtotal = displayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (displayItems.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Your cart is empty</h2>
        <Link href="/">
          <Button size="lg">Browse Movies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
      {/* Cart Items List */}
      <div className="flex flex-col gap-6">
        {displayItems.map((item, index) => (
          <div key={item.id} className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl border shadow-sm items-center">
            {/* Thumbnail */}
            <Link href={`/movie/${item.id}`} className="shrink-0 relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg overflow-hidden bg-slate-200">
              <Image
                src={item.imageUrl || '/placeholder-movie.jpg'}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 80px, 96px"
                priority={index === 0}
              />
            </Link>

            {/* Details & Actions */}
            <div className="flex flex-col flex-1 h-full justify-between py-1">
              <div>
                <Link href={`/movie/${item.id}`} className="font-bold text-lg hover:underline line-clamp-2">
                  {item.title}
                </Link>
                <div className="font-bold text-slate-600 mt-1">
                  {formatPrice(item.price)}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center border rounded-lg overflow-hidden bg-slate-50">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-slate-200 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-slate-200 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-9 w-9"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Item Total (Desktop only) */}
            <div className="hidden sm:block font-extrabold text-xl ml-4 shrink-0 w-24 text-right">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={clearCart} className="text-muted-foreground">
            Clear Cart
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-slate-50 border rounded-2xl p-6 sticky top-24">
        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
        
        <div className="space-y-4 text-sm font-medium text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-slate-900 font-bold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span className="text-slate-900 font-bold">{formatPrice(0)}</span>
          </div>
          <hr className="border-slate-200" />
          <div className="flex justify-between text-lg text-slate-900">
            <span className="font-bold">Total</span>
            <span className="font-extrabold">{formatPrice(subtotal)}</span>
          </div>
        </div>

        <Button size="lg" className="w-full mt-8 h-12 rounded-xl font-bold shadow-lg gap-2 text-base">
          <CreditCard className="w-5 h-5" />
          Checkout
        </Button>
      </div>
    </div>
  );
}
