import { prisma } from "@/lib/prisma";

function currencyFromCents(value: number): string {
  return `$${(value / 100).toFixed(2)}`;
}

export default async function AdminOverviewPage() {
  const [moviesCount, ordersCount, revenueAggregate] = await Promise.all([
    prisma.movie.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  const totalRevenue = revenueAggregate._sum.totalAmount ?? 0;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Optional admin overview with basic platform metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Movies</p>
          <p className="mt-1 text-2xl font-semibold">{moviesCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="mt-1 text-2xl font-semibold">{ordersCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="mt-1 text-2xl font-semibold">
            {currencyFromCents(totalRevenue)}
          </p>
        </div>
      </div>
    </section>
  );
}
