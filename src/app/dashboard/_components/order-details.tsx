"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package, MapPin, CreditCard, ShoppingBag } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useRouter, useSearchParams } from "next/navigation"

interface OrderDetailsProps {
  order: any // We'll keep it simple for now
}

export function OrderDetailsSheet({ order }: OrderDetailsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOpen = !!searchParams.get("order")

  const onClose = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("order")
    router.push(`/dashboard?${params.toString()}`, { scroll: false })
  }

  if (!order) return null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">Order Details</SheetTitle>
          </div>
          <SheetDescription className="flex items-center gap-2">
            Order ID: <span className="font-mono text-foreground font-medium">{order.id}</span>
          </SheetDescription>
          <div className="flex items-center gap-2">
            <Badge variant={order.status === "COMPLETED" ? "default" : "secondary"}>
              {order.status}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* INFO SECTION */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="size-3" /> Date
              </p>
              <p className="text-sm font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="size-3" /> Payment
              </p>
              <p className="text-sm font-medium">Credit Card (****)</p>
            </div>
          </div>

          <Separator />

          {/* SHIPPING SECTION */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Shipping Address
            </h3>
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border">
              <p className="text-foreground font-medium">
                Shipping details are not available in the current schema.
              </p>
            </div>
          </div>

          <Separator />

          {/* ITEMS SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ShoppingBag className="size-4 text-primary" /> Order Items ({order.orderItems.length})
            </h3>
            <div className="space-y-3">
              {order.orderItems.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 bg-card p-2 rounded-md border shadow-sm">
                  <div className="size-12 bg-muted rounded overflow-hidden flex-shrink-0 border">
                    {item.movie.imageUrl ? (
                      <img src={item.movie.imageUrl} alt={item.movie.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="size-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.movie.title}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">${item.priceAtPurchase.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* TOTAL SECTION */}
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${(order.totalAmount * 0.9).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-muted-foreground">Tax & Shipping</span>
              <span>${(order.totalAmount * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Amount</span>
              <span className="text-xl font-black text-primary">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
