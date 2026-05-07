import { prisma } from '@/lib/prisma';
import { getCartCookies } from '@/actions/cart';
import CartClientView from '@/components/cart/CartClientView';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cartCookies = await getCartCookies();
  
  if (cartCookies.length === 0) {
    return (
      <main className="container mx-auto py-16 px-4 max-w-4xl">
        <h1 className="text-4xl font-extrabold mb-8">Your Cart</h1>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground">Looks like you haven't added any movies yet.</p>
        </div>
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

  // Map the quantities from the cookie to the fetched movies
  const cartItems = movies.map(movie => {
    const cookieItem = cartCookies.find(item => item.id === movie.id);
    return {
      ...movie,
      quantity: cookieItem?.quantity || 1
    };
  });

  return (
    <main className="container mx-auto py-16 px-4 max-w-5xl">
      <h1 className="text-4xl font-extrabold mb-8">Your Cart</h1>
      <CartClientView initialItems={cartItems} />
    </main>
  );
}
