import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function currencyFromCents(value: number): string {
  return `$${(value / 100).toFixed(2)}`;
}

export default async function AdminOverviewPage() {
  const [moviesCount, ordersCount, revenueAggregate, recentOrders, topMovies] =
    await Promise.all([
      prisma.movie.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { orderDate: "desc" },
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
            _count: "desc",
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
    ]);

  const totalRevenue = revenueAggregate._sum.totalAmount ?? 0;

  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sales Statistics</h2>
        <p className="text-sm text-muted-foreground">
          Real-time platform performance and sales metrics.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
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
            {currencyFromCents(totalRevenue)}
          </p>
        </div>
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
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {currencyFromCents(order.totalAmount)}
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
                    <TableCell className="text-right">{movie._count.orderItems}</TableCell>
                    <TableCell className="text-right">
                      {currencyFromCents(movie.price)}
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
