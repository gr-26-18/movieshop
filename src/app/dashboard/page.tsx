import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { MovieThumbnail } from './_components/movie-thumbnail';

import { OrderDetailsSheet } from './_components/order-details';
/* DASHBOARD PAGE COMPONENT
 * Server Component — fetches user's order history.
 */

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const selectedOrderId = params.order;

  // TODO(auth): replace this placeholder with Better Auth session user id
  // once auth integration is merged by teammate.
  const userId = 'placeholder-user-id';

  /* Get all orders for this user with order items. */

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: { orderDate: 'desc' },
  });

  const selectedOrder = selectedOrderId
    ? orders.find((o) => o.id === selectedOrderId)
    : null;

  /* Calculate the statistics */

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Welcome back, Samir
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your movie collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold">{totalSpent.toFixed(2)} kr</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="text-2xl font-bold">{pendingOrders}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Order History</h2>
        </div>

        {orders.length > 0 ? (
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order.id} className="space-y-4 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        Order #{order.id.slice(-8)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {order.totalAmount.toFixed(2)} kr
                    </p>
                    <Link
                      className="text-sm text-blue-600 hover:underline"
                      href={`/dashboard?order=${order.id}`}
                    >
                      View order
                    </Link>
                  </div>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className="rounded border bg-gray-50 p-4">
                    <p className="mb-3 text-sm font-semibold">Items</p>
                    <ul className="space-y-2">
                      {order.orderItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>
                            {item.movie.title} x{item.quantity}
                          </span>
                          <span className="font-semibold">
                            ${item.priceAtPurchase.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="mb-4 text-gray-600">
              Start browsing our movie collection to make your first purchase
            </p>
            <Link className="text-blue-600 hover:underline" href="/">
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* Displays order status with appropriate colors. */

function StatusBadge({
  status,
}: {
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}) {
  const statusColors: Record<'PENDING' | 'COMPLETED' | 'CANCELLED', string> = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 text-xs font-medium rounded-full border',
        statusColors[status],
      )}
    >
      {status}
    </span>
  );
}

/*  Helper: Class name utility */

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
