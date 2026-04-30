Here's your OrderDetailsSheet component with thorough, educational comments explaining every step:

```typescript
// ============================================================================
// ORDER DETAILS SHEET - Slide-out Panel for Showing Order Information
// ============================================================================
// This is a client component that displays detailed order information in a sheet
// Sheet slides in from the right side (like a modal drawer)
// Opens when URL has "order" query parameter, closes when parameter is removed
// Shows order items, shipping info, payment details, and total amount
// ============================================================================

// ----------------------------------------------------------------------------
// DIRECTIVE: "USE CLIENT"
// ----------------------------------------------------------------------------
// "use client" marks this as a Client Component (runs in the browser)
// Required because this component:
// - Uses React hooks (useRouter, useSearchParams)
// - Has interactive sheet that opens/closes
// - Reads and modifies URL query parameters
// - Handles user events (onOpenChange)
"use client"

// ----------------------------------------------------------------------------
// UI COMPONENT IMPORTS (shadcn/ui)
// ----------------------------------------------------------------------------

// Import Sheet components for the slide-out panel
// Sheet: Container component for the drawer
// SheetContent: The actual content area that slides in
// SheetDescription: Helper text below the title
// SheetHeader: Top section with title and description
// SheetTitle: Main heading of the sheet
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// Import Badge component for order status display
// Badge: Small label/pill for status indicators
import { Badge } from "@/components/ui/badge"

// Import Separator component for dividing sections
// Separator: Horizontal line that visually separates content areas
import { Separator } from "@/components/ui/separator"

// ----------------------------------------------------------------------------
// ICON IMPORTS (Lucide React)
// ----------------------------------------------------------------------------
// Import icons for visual enhancement of different sections
import { 
  Calendar,      // Date/time icon for order date section
  Package,       // Box icon for item placeholder when no image
  MapPin,        // Location pin for shipping address section
  CreditCard,    // Payment card icon for payment method section
  ShoppingBag,   // Shopping bag icon for order items section
} from "lucide-react"

// ----------------------------------------------------------------------------
// NEXT.JS NAVIGATION IMPORTS
// ----------------------------------------------------------------------------
// Import Next.js navigation hooks for URL manipulation
import { useRouter, useSearchParams } from "next/navigation"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Define the props that this component accepts
interface OrderDetailsProps {
  order: any // We'll keep it simple for now
  // TODO: Replace 'any' with proper type when order schema is defined
  // Expected structure:
  // {
  //   id: string
  //   status: "COMPLETED" | "PENDING" | "CANCELLED" | "SHIPPED"
  //   orderDate: string | Date
  //   totalAmount: number
  //   orderItems: Array<{
  //     id: string
  //     quantity: number
  //     priceAtPurchase: number
  //     movie: {
  //       title: string
  //       imageUrl?: string | null
  //     }
  //   }>
  // }
}

// ============================================================================
// ORDER DETAILS SHEET COMPONENT
// ============================================================================
// This component renders a slide-out panel with detailed order information
// It's controlled by URL state - opens when "order" query param exists
// Shows order ID, status, date, payment, shipping, items, and total
// ============================================================================

export function OrderDetailsSheet({ order }: OrderDetailsProps) {
  // --------------------------------------------------------------------------
  // HOOKS INITIALIZATION
  // --------------------------------------------------------------------------
  
  // Get Next.js router instance for programmatic navigation
  // Used to modify URL when closing the sheet
  const router = useRouter()
  
  // Get search/query parameters from the current URL
  // Example: /dashboard?order=123&tab=pending
  // searchParams.get("order") would return "123"
  const searchParams = useSearchParams()
  
  // --------------------------------------------------------------------------
  // SHEET VISIBILITY STATE (Derived from URL)
  // --------------------------------------------------------------------------
  // Determine if the sheet should be open based on URL query parameter
  // !! converts the value to boolean:
  // - If "order" parameter exists → true (open)
  // - If "order" parameter doesn't exist → false (closed)
  // 
  // Example URLs:
  // /dashboard → isOpen = false
  // /dashboard?order=abc123 → isOpen = true
  const isOpen = !!searchParams.get("order")
  
  // --------------------------------------------------------------------------
  // CLOSE HANDLER FUNCTION
  // --------------------------------------------------------------------------
  // This function is called when the sheet should close
  // It removes the "order" parameter from the URL and navigates back
  const onClose = () => {
    // Create a new URLSearchParams object from the current parameters
    // This preserves other query parameters (e.g., ?tab=pending&page=2)
    const params = new URLSearchParams(searchParams.toString())
    
    // Delete the "order" parameter from the URL
    // This removes the order ID that was controlling the sheet
    params.delete("order")
    
    // Navigate to the dashboard with the updated query string
    // router.push() updates the URL without a full page reload
    // { scroll: false } prevents the page from scrolling to the top
    // This maintains the user's scroll position on the dashboard
    router.push(`/dashboard?${params.toString()}`, { scroll: false })
    
    // After this runs:
    // - URL changes from /dashboard?order=123 to /dashboard
    // - isOpen becomes false (since searchParams.get("order") is now null)
    // - Sheet automatically closes
  }
  
  // --------------------------------------------------------------------------
  // EARLY RETURN - No order data
  // --------------------------------------------------------------------------
  // If no order prop is provided, don't render anything
  // This prevents rendering an empty sheet
  if (!order) return null

  // --------------------------------------------------------------------------
  // RENDER THE SHEET
  // --------------------------------------------------------------------------
  return (
    // ------------------------------------------------------------------------
    // SHEET COMPONENT - Main slide-out panel container
    // ------------------------------------------------------------------------
    <Sheet 
      open={isOpen}  // Controlled by URL parameter (true/false)
      onOpenChange={(open) => !open && onClose()}  // Handle close events
    >
      {/* 
        onOpenChange explanation:
        - This callback fires when the sheet's open state changes
        - User can close sheet by: clicking outside, pressing ESC, or clicking X
        - When that happens, 'open' becomes false
        - !open && onClose() means: if open is false (closing), call onClose()
        - This ensures URL stays in sync with sheet visibility
      */}
      
      {/* -------------------------------------------------------------------- */}
      {/* SHEET CONTENT - The actual sliding panel */}
      {/* -------------------------------------------------------------------- */}
      <SheetContent className="sm:max-w-md overflow-y-auto">
        {/* 
          Styling explanation:
          - sm:max-w-md: On screens >=640px, max width is 28rem (448px)
          - overflow-y-auto: Allows vertical scrolling if content exceeds height
        */}
        
        {/* ---------------------------------------------------------------- */}
        {/* SHEET HEADER - Top section with title and order info */}
        {/* ---------------------------------------------------------------- */}
        <SheetHeader className="space-y-4">
          {/* Title and action buttons row */}
          <div className="flex items-center justify-between">
            {/* Main title of the sheet */}
            <SheetTitle className="text-2xl font-bold">Order Details</SheetTitle>
            
            {/* 
              Note: No close button here because SheetContent includes one by default
              The default X button triggers onOpenChange(false)
            */}
          </div>
          
          {/* Order ID display - below the title */}
          <SheetDescription className="flex items-center gap-2">
            Order ID: 
            {/* 
              font-mono: Monospace font (Courier, Consolas, etc.)
              text-foreground: Default text color from theme
              font-medium: Medium font weight (500)
              Monospace makes order IDs easier to read/copy
            */}
            <span className="font-mono text-foreground font-medium">{order.id}</span>
          </SheetDescription>
          
          {/* Order Status Badge */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={order.status === "COMPLETED" ? "default" : "secondary"}
            >
              {order.status}
            </Badge>
            {/* 
              Badge variant logic:
              - "default" (usually green) for COMPLETED orders
              - "secondary" (usually gray) for all other statuses
              
              Other possible statuses: PENDING, SHIPPED, CANCELLED, REFUNDED
              You might want to add more specific colors:
              - PENDING → "outline" (yellow)
              - CANCELLED → "destructive" (red)
              - SHIPPED → "default" (blue/green)
            */}
          </div>
        </SheetHeader>
        
        {/* ---------------------------------------------------------------- */}
        {/* MAIN CONTENT AREA - Order details sections */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-8 space-y-6">
          {/* -------------------------------------------------------------- */}
          {/* INFO SECTION - Order date and payment method */}
          {/* -------------------------------------------------------------- */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date Column */}
            <div className="space-y-1">
              {/* 
                Section label with icon
                text-xs: Extra small text (0.75rem / 12px)
                text-muted-foreground: Muted color (grayish)
                uppercase: ALL CAPS
                tracking-wider: Increased letter spacing
                flex items-center gap-1: Horizontal layout with icon
              */}
              <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="size-3" /> Date
              </p>
              {/* 
                Order date formatted with toLocaleDateString()
                Example: "1/15/2024" or "15/01/2024" based on user's locale
              */}
              <p className="text-sm font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            
            {/* Payment Column */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="size-3" /> Payment
              </p>
              {/* 
                Placeholder payment method text
                TODO: Replace with actual payment method from order data
                Possible improvements: show last 4 digits of card
              */}
              <p className="text-sm font-medium">Credit Card (****)</p>
            </div>
          </div>
          
          {/* Separator line between sections */}
          <Separator />
          
          {/* -------------------------------------------------------------- */}
          {/* SHIPPING SECTION - Delivery address */}
          {/* -------------------------------------------------------------- */}
          <div className="space-y-3">
            {/* Section heading with icon */}
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Shipping Address
            </h3>
            
            {/* 
              Shipping details container
              bg-muted/50: 50% opacity muted background
              p-3: Padding of 0.75rem (12px)
              rounded-lg: Border radius of 0.5rem (8px)
              border: Adds a 1px border
            */}
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border">
              {/* 
                Placeholder text because shipping data isn't in current schema
                TODO: Add shipping address fields to order schema
              */}
              <p className="text-foreground font-medium">
                Shipping details are not available in the current schema.
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* -------------------------------------------------------------- */}
          {/* ITEMS SECTION - List of products in the order */}
          {/* -------------------------------------------------------------- */}
          <div className="space-y-4">
            {/* Section heading with item count */}
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ShoppingBag className="size-4 text-primary" /> 
              Order Items ({order.orderItems.length})
            </h3>
            
            {/* Items list container */}
            <div className="space-y-3">
              {order.orderItems.map((item: any) => (
                // Each item card - unique key for React reconciliation
                <div key={item.id} className="flex items-center gap-3 bg-card p-2 rounded-md border shadow-sm">
                  
                  {/* Movie Thumbnail / Image Placeholder */}
                  <div className="size-12 bg-muted rounded overflow-hidden flex-shrink-0 border">
                    {item.movie.imageUrl ? (
                      // Show actual movie image if available
                      <img 
                        src={item.movie.imageUrl} 
                        alt={item.movie.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      // Show Package icon if no image
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="size-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {/* Item Info (Title + Quantity) */}
                  <div className="flex-1 min-w-0">
                    {/* 
                      min-w-0: Prevents flex item from overflowing
                      truncate: Adds ellipsis (...) if text overflows
                    */}
                    <p className="text-sm font-medium truncate">{item.movie.title}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  
                  {/* Item Price */}
                  <p className="text-sm font-bold">
                    ${item.priceAtPurchase.toFixed(2)}
                    {/* 
                      toFixed(2): Formats number with 2 decimal places
                      Example: 19.99 → "19.99", 20 → "20.00"
                    */}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* -------------------------------------------------------------- */}
          {/* TOTAL SECTION - Subtotal, Tax, and Grand Total */}
          {/* -------------------------------------------------------------- */}
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
            {/* 
              Styling:
              - bg-primary/5: 5% opacity primary color background (subtle tint)
              - rounded-xl: Extra large border radius (0.75rem / 12px)
              - border-primary/10: 10% opacity primary color border
            */}
            
            {/* Subtotal Row */}
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              {/* 
                TODO: Replace placeholder calculation with actual subtotal
                Currently assumes subtotal is 90% of total (tax/shipping 10%)
                This is a placeholder - should come from order data
              */}
              <span>${(order.totalAmount * 0.9).toFixed(2)}</span>
            </div>
            
            {/* Tax & Shipping Row */}
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-muted-foreground">Tax & Shipping</span>
              {/* Tax/shipping calculated as 10% of total (placeholder) */}
              <span>${(order.totalAmount * 0.1).toFixed(2)}</span>
            </div>
            
            {/* Grand Total Row - Highlighted */}
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Amount</span>
              <span className="text-xl font-black text-primary">
                ${order.totalAmount.toFixed(2)}
                {/* 
                  text-xl: Extra large text (1.25rem / 20px)
                  font-black: Blackest font weight (900)
                  text-primary: Primary theme color (bold emphasis)
                */}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ============================================================================
// COMPLETE COMPONENT FLOW EXPLANATION
// ============================================================================
//
// Scenario 1: User opens order details
// -------------------------------------
// 1. User clicks "View Order" button on a order card
// 2. onClick handler navigates: router.push("/dashboard?order=12345")
// 3. URL changes, page re-renders
// 4. searchParams.get("order") returns "12345" → isOpen = true
// 5. OrderDetailsSheet receives order prop from parent
// 6. Sheet opens (slides in from right)
// 7. User sees detailed order information
//
// Scenario 2: User closes order details
// --------------------------------------
// 8. User clicks the X button, clicks outside, or presses ESC
// 9. Sheet's onOpenChange fires with open = false
// 10. onClose() function is called
// 11. URL parameters are updated ("order" removed)
// 12. router.push() navigates to clean URL
// 13. isOpen becomes false (since "order" param is gone)
// 14. Sheet closes
// 15. User returns to dashboard view
//
// ============================================================================
// URL STATE MANAGEMENT PATTERN
// ============================================================================
//
// This component uses URL as the source of truth (good practice!)
// 
// Why URL state instead of React state?
// --------------------------------------
// ✓ Shareable: Users can copy/paste URL with order ID
// ✓ Bookmarkable: Can save order details URL
// ✓ Browser history: Back/forward buttons work
// ✓ Refresh-safe: Page reload shows same order
// ✓ Deep linkable: Can link directly to order from email
//
// Alternative (bad) approach using React state:
// ----------------------------------------------
// const [selectedOrder, setSelectedOrder] = useState(null)
// 
// Problems:
// ✗ State lost on refresh
// ✗ Can't share URL
// ✗ Back button doesn't work
// ✗ No deep linking
//
// ============================================================================
// TYPICAL PARENT COMPONENT USAGE
// ============================================================================
//
// "use client"
// 
// import { useState } from "react"
// import { useSearchParams } from "next/navigation"
// import { OrderDetailsSheet } from "./order-details-sheet"
// import { Button } from "@/components/ui/button"
//
// export function OrderList() {
//   const searchParams = useSearchParams()
//   const orderId = searchParams.get("order")
//   
//   // Fetch order data when orderId changes
//   const { data: order } = useQuery({
//     queryKey: ["order", orderId],
//     queryFn: () => fetchOrder(orderId),
//     enabled: !!orderId,  // Only fetch if orderId exists
//   })
//   
//   return (
//     <>
//       {orders.map(order => (
//         <OrderCard 
//           key={order.id}
//           order={order}
//           onViewDetails={() => router.push(`/dashboard?order=${order.id}`)}
//         />
//       ))}
//       
//       <OrderDetailsSheet order={order} />
//     </>
//   )
// }
//
// ============================================================================
// POTENTIAL ISSUES & IMPROVEMENTS
// ============================================================================
//
// Issue 1: Hardcoded payment method
// ---------------------------------
// Current: "Credit Card (****)" - always shows the same text
// Problem: Doesn't reflect actual payment method
// Fix: Add paymentMethod field to order schema
//
// Issue 2: Shipping details not implemented
// ------------------------------------------
// Current: Shows placeholder text
// Problem: No actual shipping address displayed
// Fix: Add shipping fields to order schema:
//   shippingAddress: string
//   shippingCity: string
//   shippingZipCode: string
//   shippingCountry: string
//
// Issue 3: Subtotal/tax calculations are incorrect
// ------------------------------------------------
// Current: Simple 90/10 split (subtotal = total * 0.9)
// Problem: Tax varies by location, may be different rates
// Fix: Store subtotal and tax separately in order schema
//   subtotal: number
//   tax: number
//   shippingCost: number
//   totalAmount: number (subtotal + tax + shipping)
//
// Issue 4: No loading state while fetching order
// -----------------------------------------------
// Problem: While order data loads, sheet might open with null order
// Fix: Add loading skeleton to sheet
//
// Issue 5: No error handling for failed order fetch
// --------------------------------------------------
// Problem: If fetch fails, user sees nothing or broken UI
// Fix: Add error state with retry button
//
// Issue 6: Order status colors could be more specific
// ----------------------------------------------------
// Current: Only COMPLETED vs everything else
// Fix: Add specific variants for each status
//
// const getStatusVariant = (status: string) => {
//   switch (status) {
//     case "COMPLETED": return "default"
//     case "PENDING": return "outline"
//     case "SHIPPED": return "secondary"
//     case "CANCELLED": return "destructive"
//     default: return "secondary"
//   }
// }
//
// Issue 7: No order tracking information
// ---------------------------------------
// Problem: No way to track shipping progress
// Fix: Add tracking number and carrier field to schema
//
// Issue 8: No customer support actions
// -------------------------------------
// Problem: Can't request refund or help directly
// Fix: Add "Need Help?" button with contact options
//
// Issue 9: No print/save order functionality
// -------------------------------------------
// Problem: Users can't easily print or save order details
// Fix: Add print button that opens print-friendly view
//
// ============================================================================
// IMPROVED VERSION EXAMPLE (With proper types and data)
// ============================================================================
//
// "use client"
//
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet"
// import { Badge } from "@/components/ui/badge"
// import { Calendar, Package, MapPin, CreditCard, ShoppingBag } from "lucide-react"
// import { Separator } from "@/components/ui/separator"
// import { useRouter, useSearchParams } from "next/navigation"
// import Image from "next/image"
// import { Skeleton } from "@/components/ui/skeleton"
//
// // Proper type definitions
// interface OrderItem {
//   id: string
//   quantity: number
//   priceAtPurchase: number
//   movie: {
//     title: string
//     imageUrl?: string | null
//   }
// }
//
// interface Order {
//   id: string
//   status: "PENDING" | "COMPLETED" | "SHIPPED" | "CANCELLED"
//   orderDate: string
//   totalAmount: number
//   subtotal: number
//   tax: number
//   shippingCost: number
//   paymentMethod: string
//   paymentLast4?: string  // Last 4 digits of card
//   shippingAddress?: {
//     street: string
//     city: string
//     zipCode: string
//     country: string
//   }
//   trackingNumber?: string
//   carrier?: string
//   orderItems: OrderItem[]
// }
//
// interface OrderDetailsSheetProps {
//   order: Order | null
//   isLoading?: boolean
// }
//
// // Helper function for status badge variants
// const getStatusVariant = (status: Order["status"]) => {
//   switch (status) {
//     case "COMPLETED": return "default"
//     case "SHIPPED": return "secondary"
//     case "PENDING": return "outline"
//     case "CANCELLED": return "destructive"
//     default: return "secondary"
//   }
// }
//
// export function OrderDetailsSheet({ order, isLoading = false }: OrderDetailsSheetProps) {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const isOpen = !!searchParams.get("order")
//
//   const onClose = () => {
//     const params = new URLSearchParams(searchParams.toString())
//     params.delete("order")
//     router.push(`/dashboard?${params.toString()}`, { scroll: false })
//   }
//
//   // Loading state
//   if (isLoading) {
//     return (
//       <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
//         <SheetContent>
//           <SheetHeader>
//             <SheetTitle>Order Details</SheetTitle>
//           </SheetHeader>
//           <div className="mt-8 space-y-4">
//             <Skeleton className="h-20 w-full" />
//             <Skeleton className="h-40 w-full" />
//             <Skeleton className="h-20 w-full" />
//           </div>
//         </SheetContent>
//       </Sheet>
//     )
//   }
//
//   if (!order) return null
//
//   return (
//     <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <SheetContent className="sm:max-w-md overflow-y-auto">
//         <SheetHeader className="space-y-4">
//           <div className="flex items-center justify-between">
//             <SheetTitle className="text-2xl font-bold">Order Details</SheetTitle>
//           </div>
//           <SheetDescription className="flex items-center gap-2">
//             Order ID: <span className="font-mono text-foreground font-medium">{order.id}</span>
//           </SheetDescription>
//           <div className="flex items-center gap-2">
//             <Badge variant={getStatusVariant(order.status)}>
//               {order.status}
//             </Badge>
//           </div>
//         </SheetHeader>
//
//         <div className="mt-8 space-y-6">
//           {/* INFO SECTION */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
//                 <Calendar className="size-3" /> Date
//               </p>
//               <p className="text-sm font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
//             </div>
//             <div className="space-y-1">
//               <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
//                 <CreditCard className="size-3" /> Payment
//               </p>
//               <p className="text-sm font-medium">
//                 {order.paymentMethod}
//                 {order.paymentLast4 && ` (****${order.paymentLast4})`}
//               </p>
//             </div>
//           </div>
//
//           <Separator />
//
//           {/* SHIPPING SECTION */}
//           <div className="space-y-3">
//             <h3 className="text-sm font-semibold flex items-center gap-2">
//               <MapPin className="size-4 text-primary" /> Shipping Address
//             </h3>
//             {order.shippingAddress ? (
//               <div className="text-sm bg-muted/50 p-3 rounded-lg border">
//                 <p>{order.shippingAddress.street}</p>
//                 <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
//                 <p>{order.shippingAddress.country}</p>
//                 {order.trackingNumber && (
//                   <p className="mt-2 pt-2 border-t text-xs">
//                     Tracking: {order.trackingNumber} ({order.carrier})
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border">
//                 <p className="text-foreground font-medium">No shipping details available</p>
//               </div>
//             )}
//           </div>
//
//           <Separator />
//
//           {/* ITEMS SECTION */}
//           <div className="space-y-4">
//             <h3 className="text-sm font-semibold flex items-center gap-2">
//               <ShoppingBag className="size-4 text-primary" /> 
//               Order Items ({order.orderItems.length})
//             </h3>
//             <div className="space-y-3">
//               {order.orderItems.map((item) => (
//                 <div key={item.id} className="flex items-center gap-3 bg-card p-2 rounded-md border shadow-sm">
//                   <div className="size-12 bg-muted rounded overflow-hidden flex-shrink-0 border">
//                     {item.movie.imageUrl ? (
//                       <Image
//                         src={item.movie.imageUrl}
//                         alt={item.movie.title}
//                         width={48}
//                         height={48}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <Package className="size-6 text-muted-foreground" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate">{item.movie.title}</p>
//                     <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
//                   </div>
//                   <p className="text-sm font-bold">${item.priceAtPurchase.toFixed(2)}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//
//           <Separator />
//
//           {/* TOTAL SECTION */}
//           <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
//             <div className="flex justify-between items-center text-sm mb-2">
//               <span className="text-muted-foreground">Subtotal</span>
//               <span>${order.subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between items-center text-sm mb-2">
//               <span className="text-muted-foreground">Tax & Shipping</span>
//               <span>${(order.tax + order.shippingCost).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="font-bold">Total Amount</span>
//               <span className="text-xl font-black text-primary">${order.totalAmount.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }
//
// ============================================================================
// ACCESSIBILITY CONSIDERATIONS
// ============================================================================
//
// Current features:
// -----------------
// - Sheet component has built-in accessibility (focus trap, ARIA roles)
// - Proper heading hierarchy (SheetTitle as h2)
// - Images have alt text
// - Icons are decorative (no aria-label needed)
//
// Missing features:
// -----------------
// - No aria-live region for dynamic content updates
// - No keyboard shortcuts (ESC works, but could add CMD+W)
// - Focus isn't automatically moved to sheet when opened
//
// Improvements:
// -------------
// // Add aria-label for close button (already handled by Sheet)
// // Add announcement when sheet opens
// useEffect(() => {
//   if (isOpen) {
//     const announcement = `Order details for order ${order.id}`
//     // Announce to screen readers
//   }
// }, [isOpen])
//
// ============================================================================
// PERFORMANCE CONSIDERATIONS
// ============================================================================
//
// Good:
// -----
// - Sheet renders conditionally (when open)
// - Order data fetched only when needed (in parent)
// - Images use object-cover for consistent sizing
// - No unnecessary re-renders (controlled by URL state)
//
// Potential optimizations:
// -------------------------
// 1. Memoize expensive calculations:
//    const subtotal = useMemo(() => order.subtotal, [order])
//
// 2. Use Image component for better image optimization
//
// 3. Lazy load order items if many:
//    Use virtual scrolling for long item lists
//
// ============================================================================
```

This heavily commented version explains:
- **The complete sheet flow** (opening/closing with URL state)
- **Why URL state is better than React state** for modals (shareable, bookmarkable)
- **How Sheet onOpenChange works** with external state
- **Each UI section** (header, info, shipping, items, total)
- **The placeholder calculations** and why they need improvement
- **Status badge logic** with variants
- **Potential issues** (hardcoded data, missing schemas)
- **An improved version** with proper types, loading states, and real data
- **Accessibility features** built into shadcn Sheet
- **Performance considerations** for order details

Let me know if you'd like me to elaborate on any concept like URL state management, the Sheet component's accessibility features, or how to properly type the order data!