import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <section className="space-y-10">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24 rounded-lg border" />
        <Skeleton className="h-24 rounded-lg border" />
        <Skeleton className="h-24 rounded-lg border" />
      </div>

      {/* Revenue Chart Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-[350px] w-full rounded-lg border" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders Table Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="rounded-md border p-4 space-y-4">
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Top Selling Movies Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="rounded-md border p-4 space-y-4">
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
