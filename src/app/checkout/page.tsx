import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCartCookies } from '@/actions/cart';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const cartCookies = await getCartCookies();

  if (cartCookies.length === 0) {
    return (
      <main className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Checkout</h1>
        <p className="text-slate-600 mb-8">Your cart is empty.</p>
        <a href="/" className="text-blue-500 hover:underline">Return to Home</a>
      </main>
    );
  }

  const movieIds = cartCookies.map(item => item.id);
  const movies = await prisma.movie.findMany({
    where: {
      id: { in: movieIds }
    },
    select: {
      id: true,
      title: true,
      price: true,
      imageUrl: true,
    }
  });

  // Calculate cart items with quantities
  const cartItems = movies.map(movie => {
    const cookieItem = cartCookies.find(item => item.id === movie.id);
    return {
      ...movie,
      quantity: cookieItem?.quantity || 1
    };
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <main className="container mx-auto py-16 px-4 max-w-5xl">
      <h1 className="text-4xl font-extrabold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <CheckoutForm />
        </div>

        {/* Order Summary */}
        <div className="bg-slate-50 border rounded-2xl p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate-600 line-clamp-1 mr-4">
                  {item.quantity}x {item.title}
                </span>
                <span className="font-medium text-slate-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-sm font-medium text-slate-600 border-t border-slate-200 pt-4">
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
        </div>
      </div>
    </main>
  );
}
