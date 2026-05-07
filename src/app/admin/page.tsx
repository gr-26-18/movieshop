/**
 * New added code
 */
import { prisma } from '@/lib/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RevenueChart } from './_components/revenue-chart';
import { formatPrice } from '@/lib/utils';

type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

function getStatusBadgeClass(status: OrderStatus): string {
  const styles: Record<OrderStatus, string> = {
    PENDING: 'border-amber-200 bg-amber-100 text-amber-800',
    COMPLETED: 'border-green-200 bg-green-100 text-green-800',
    CANCELLED: 'border-red-200 bg-red-100 text-red-800',
  };

  return styles[status];
}

export default async function AdminOverviewPage() {
  // Get date for 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    moviesCount,
    ordersCount,
    revenueAggregate,
    recentOrders,
    topMovies,
    chartOrders,
  ] = await Promise.all([
    prisma.movie.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { orderDate: 'desc' },
      include: {
        orderItems: {
          include: {
            movie: {
              select: { title: true },
            },
          },
        },
      },
    }),
    prisma.movie.findMany({
      take: 5,
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        title: true,
        price: true,
        _count: {
          select: { orderItems: true },
        },
      },
    }),
    prisma.order.findMany({
      where: {
        orderDate: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        orderDate: true,
        totalAmount: true,
      },
      orderBy: {
        orderDate: 'asc',
      },
    }),
  ]);

  // Build stable local date keys (YYYY-MM-DD) to avoid timezone edge cases.
  const toLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Aggregate order totals by local day.
  const revenueByDate = chartOrders.reduce<Record<string, number>>(
    (acc, order) => {
      const key = toLocalDateKey(order.orderDate);
      acc[key] = (acc[key] ?? 0) + order.totalAmount;
      return acc;
    },
    {},
  );

  // Always return a full 7-day window, filling missing days with 0.
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() - (6 - i));
    const dayKey = toLocalDateKey(dayDate);

    return {
      date: `${dayDate.toLocaleDateString('en-US', { weekday: 'short' })} ${dayDate.getDate()}`,
      revenue: revenueByDate[dayKey] ?? 0,
    };
  });

  const totalRevenue = revenueAggregate._sum.totalAmount ?? 0;

  return (
    <section className="space-y-10" aria-labelledby="admin-overview-title">
      <div>
        <h2
          id="admin-overview-title"
          className="text-2xl font-bold tracking-tight"
        >
          Sales Statistics
        </h2>
        <p className="text-sm text-muted-foreground">
          Real-time platform performance and sales metrics.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Movies</p>
          <p className="mt-1 text-2xl font-semibold">{moviesCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="mt-1 text-2xl font-semibold">{ordersCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            {formatPrice(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Revenue Chart Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
        <RevenueChart data={chartData} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-xs">
                      #{order.id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase ${getStatusBadgeClass(order.status as OrderStatus)}`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(order.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
                {recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No recent orders.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Top Selling Movies */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Top Selling Movies</h3>
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie Title</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topMovies.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell className="font-medium">{movie.title}</TableCell>
                    <TableCell className="text-right">
                      {movie._count.orderItems}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(movie.price)}
                    </TableCell>
                  </TableRow>
                ))}
                {topMovies.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No sales yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
