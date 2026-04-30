Here's your DashboardPage component with thorough, educational comments explaining every step:

```typescript
// ============================================================================
// DASHBOARD PAGE - User Dashboard with Order History and Statistics
// ============================================================================
// This is a server component that displays the user's dashboard
// Shows order statistics (total orders, total spent, pending orders)
// Lists order history with expandable details
// Uses URL query parameter to show order details sheet
// ============================================================================

// ----------------------------------------------------------------------------
// IMPORTS
// ----------------------------------------------------------------------------

// Import Next.js Link component for client-side navigation
import Link from "next/link"

// Import Prisma client for database operations
import { prisma } from "@/lib/prisma"

// Import Button component for UI actions
import { Button } from "@/components/ui/button"

// Import MovieThumbnail component for displaying movie poster images
import { MovieThumbnail } from "./_components/movie-thumbnail"

// Import OrderDetailsSheet component for detailed order view
// This is a slide-out panel that shows full order information
import { OrderDetailsSheet } from "./_components/order-details"

// ============================================================================
// DASHBOARD PAGE COMPONENT
// ============================================================================
// This is an async server component that:
// 1. Fetches user's order history from database
// 2. Calculates statistics (total orders, total spent, pending orders)
// 3. Renders dashboard UI with order list and stats
// 4. Optionally shows order details if selected via URL
// ============================================================================

/* DASHBOARD PAGE COMPONENT
 * Server Component — fetches user's order history.
 */

export default async function DashboardPage({ 
  searchParams 
}: { 
  // searchParams contains URL query parameters
  // It's a Promise because Next.js may need to await it
  // Example URL: /dashboard?order=12345
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  // --------------------------------------------------------------------------
  // STEP 1: Extract URL Parameters
  // --------------------------------------------------------------------------
  // Await the searchParams promise to get the actual query parameters
  const params = await searchParams;
  
  // Get the "order" query parameter (if present)
  // This is the ID of the order to show details for
  // Example: /dashboard?order=abc123 → selectedOrderId = "abc123"
  const selectedOrderId = params.order;

  // --------------------------------------------------------------------------
  // STEP 2: Get Current User ID (Authentication)
  // --------------------------------------------------------------------------
  // TODO(auth): replace this placeholder with Better Auth session user id
  // once auth integration is merged by teammate.
  // 
  // This is a placeholder - in production, you would get the user ID from:
  // const session = await auth.api.getSession({ headers: await headers() })
  // const userId = session?.user?.id
  const userId = "placeholder-user-id";

  // --------------------------------------------------------------------------
  // STEP 3: Fetch User's Orders from Database
  // --------------------------------------------------------------------------
  /* Get all orders for this user with order items. */

  const orders = await prisma.order.findMany({
    // Filter orders by the current user's ID
    where: { userId },
    
    // Include related data in the query (JOIN)
    include: {
      // Include order items for each order
      orderItems: {
        // Include movie data for each order item
        include: {
          movie: {
            // Only select specific fields from movie (performance optimization)
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    
    // Sort orders by date, newest first
    orderBy: { orderDate: "desc" },
  });
  
  // orders structure:
  // [
  //   {
  //     id: "order_123",
  //     status: "COMPLETED",
  //     orderDate: Date object,
  //     totalAmount: 49.99,
  //     orderItems: [
  //       {
  //         id: "item_456",
  //         quantity: 2,
  //         priceAtPurchase: 24.99,
  //         movie: { id: "movie_789", title: "Inception", imageUrl: "..." }
  //       }
  //     ]
  //   }
  // ]

  // --------------------------------------------------------------------------
  // STEP 4: Find Selected Order (if any)
  // --------------------------------------------------------------------------
  // If there's an order ID in the URL, find that order in the fetched list
  // Otherwise, selectedOrder is null
  const selectedOrder = selectedOrderId 
    ? orders.find(o => o.id === selectedOrderId) 
    : null;
  
  // This is used to pass to the OrderDetailsSheet component
  // The sheet will show when selectedOrder is not null

  // --------------------------------------------------------------------------
  // STEP 5: Calculate Order Statistics
  // --------------------------------------------------------------------------
  /* Calculate the statistics */

  // Total number of orders
  const totalOrders = orders.length;
  
  // Total amount spent across all orders
  // reduce() sums up all order.totalAmount values
  // Starts with 0, adds each order's totalAmount
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Count of orders with status "PENDING"
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  // --------------------------------------------------------------------------
  // STEP 6: Render the Dashboard UI
  // --------------------------------------------------------------------------
  return (
    // Main container with consistent vertical spacing
    // space-y-8: Adds 2rem (32px) margin between direct children
    <div className="space-y-8">
      
      {/* ------------------------------------------------------------ */}
      {/* WELCOME SECTION - User greeting and description */}
      {/* ------------------------------------------------------------ */}
      <div>
        {/* 
          Page title - Welcome message
          text-3xl: 1.875rem (30px) font size
          font-bold: Bold weight
          tracking-tight: Tight letter spacing
          mb-2: Margin bottom of 0.5rem (8px)
        */}
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, Samir</h1>
        
        {/* 
          Subtitle/description
          text-muted-foreground: Muted color from theme
        */}
        <p className="text-muted-foreground">
          Here's what's happening with your movie collection.
        </p>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* STATISTICS CARDS - Total Orders, Total Spent, Pending Orders */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Orders Card */}
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        
        {/* Total Spent Card */}
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Total Spent</p>
          {/* 
            toFixed(2): Formats number to 2 decimal places
            Example: 49.99 → "49.99", 50 → "50.00"
          */}
          <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
        </div>
        
        {/* Pending Orders Card */}
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="text-2xl font-bold">{pendingOrders}</p>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* ORDER HISTORY SECTION - List of all user orders */}
      {/* ------------------------------------------------------------ */}
      <div className="rounded-lg border bg-white">
        
        {/* Section Header */}
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Order History</h2>
        </div>

        {/* Conditional Rendering: Orders exist OR Empty state */}
        {orders.length > 0 ? (
          // ----------------------------------------------------------
          // CASE 1: User has orders - Display them in a list
          // ----------------------------------------------------------
          <div className="divide-y">
            {orders.map((order) => (
              // Each order card - unique key for React reconciliation
              <div key={order.id} className="space-y-4 p-6">
                
                {/* Order Header Row - Order ID, Status, Date, Total */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Left side: Order ID and Status */}
                  <div>
                    {/* Order ID and Status row */}
                    <div className="flex items-center gap-3">
                      {/* 
                        Order ID - show last 8 characters only
                        slice(-8): Takes last 8 characters of the ID
                        This makes it more readable (full IDs are long)
                        Example: "order_abc123xyz" → "abc123xyz"
                      */}
                      <span className="font-semibold">Order #{order.id.slice(-8)}</span>
                      
                      {/* Status badge with appropriate color */}
                      <StatusBadge status={order.status} />
                    </div>
                    
                    {/* Order Date - formatted to local date string */}
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Right side: Total and View Link */}
                  <div className="text-right">
                    {/* Order Total Amount */}
                    <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
                    
                    {/* 
                      View order link - updates URL to show order details
                      Clicking this adds ?order=id to the URL
                      This triggers the OrderDetailsSheet to open
                    */}
                    <Link 
                      className="text-sm text-blue-600 hover:underline" 
                      href={`/dashboard?order=${order.id}`}
                    >
                      View order
                    </Link>
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* EXPANDED ORDER ITEMS - Shows when order is selected */}
                {/* ---------------------------------------------------- */}
                {/* Only render if this order is the currently selected one */}
                {selectedOrder?.id === order.id && (
                  <div className="rounded border bg-gray-50 p-4">
                    {/* Section title */}
                    <p className="mb-3 text-sm font-semibold">Items</p>
                    
                    {/* List of items in this order */}
                    <ul className="space-y-2">
                      {order.orderItems.map((item) => (
                        <li key={item.id} className="flex items-center justify-between text-sm">
                          {/* Item name and quantity */}
                          <span>
                            {item.movie.title} x{item.quantity}
                          </span>
                          
                          {/* Item price */}
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
          // ----------------------------------------------------------
          // CASE 2: No orders - Show empty state with call to action
          // ----------------------------------------------------------
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
      
      {/* ------------------------------------------------------------ */}
      {/* ORDER DETAILS SHEET - Slide-out panel for full order info */}
      {/* ------------------------------------------------------------ */}
      {/* 
        This component renders a sheet that slides in from the right
        It shows full order details including:
        - Order ID and status
        - Order date and payment method
        - Shipping address
        - All items with images
        - Subtotal, tax, and total
        
        The sheet is controlled by URL state:
        - Opens when ?order=id is in URL
        - Closes when "order" parameter is removed
      */}
      <OrderDetailsSheet order={selectedOrder} />
    </div>
  )
}

// ============================================================================
// STATUS BADGE COMPONENT
// ============================================================================
// Displays order status with appropriate colors
// Different colors for different statuses provide visual cues

/* Displays order status with appropriate colors. */

function StatusBadge({ status }: { status: "PENDING" | "COMPLETED" | "CANCELLED" }) {
  // Status color mapping - each status has unique color scheme
  const statusColors: Record<"PENDING" | "COMPLETED" | "CANCELLED", string> = {
    // PENDING: Amber/yellow - indicates waiting/processing
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    
    // COMPLETED: Green - indicates success/done
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    
    // CANCELLED: Red - indicates failure/error
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <span
      className={cn(
        // Base classes for all badges
        "px-2.5 py-0.5 text-xs font-medium rounded-full border",
        // Status-specific colors
        statusColors[status]
      )}
    >
      {status}
    </span>
  )
}

// ============================================================================
// HELPER FUNCTION: Class Name Utility
// ============================================================================
// Simple utility to conditionally join CSS classes

/* Helper: Class name utility */

function cn(...classes: (string | boolean | undefined)[]) {
  // Filter out falsy values (false, undefined, null, empty string)
  // Then join remaining classes with spaces
  return classes.filter(Boolean).join(" ")
}

// ============================================================================
// COMPLETE USER FLOW
// ============================================================================
//
// Scenario 1: User visits dashboard (no selected order)
// -------------------------------------------------------
// 1. User navigates to /dashboard
// 2. DashboardPage server component executes:
//    - Fetches user's orders from database
//    - Calculates statistics
//    - selectedOrderId is undefined (no ?order in URL)
// 3. Renders dashboard with:
//    - Welcome message
//    - Statistics cards (Total Orders, Total Spent, Pending Orders)
//    - List of all orders (collapsed, showing only header)
// 4. OrderDetailsSheet receives order={null} → doesn't render
// 5. User sees order history with "View order" links on each order
//
// Scenario 2: User clicks "View order" link
// ------------------------------------------
// 1. User clicks "View order" on a specific order
// 2. Link navigates to: /dashboard?order=order_123
// 3. Page re-renders with new URL
// 4. DashboardPage executes again:
//    - selectedOrderId = "order_123"
//    - Finds the order in the orders array
//    - selectedOrder = order object
// 5. Order card for the selected order shows expanded items section
// 6. OrderDetailsSheet receives order object → opens sheet
// 7. Sheet slides in showing full order details
// 8. URL now has ?order=id - user can bookmark or share
//
// Scenario 3: User closes order details (clicks X on sheet)
// ----------------------------------------------------------
// 1. User clicks the X button on the OrderDetailsSheet
// 2. Sheet's onClose function is called
// 3. URL is updated: /dashboard?order=order_123 → /dashboard
// 4. Page re-renders without selected order
// 5. Expanded items section collapses
// 6. Sheet closes
// 7. User returns to collapsed order list
//
// ============================================================================
// VISUAL LAYOUT
// ============================================================================
//
// Desktop View:
// -------------
// ┌────────────────────────────────────────────────────────────────────┐
// │ Welcome back, Samir                                               │
// │ Here's what's happening with your movie collection.               │
// ├────────────────────────────────────────────────────────────────────┤
// │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                   │
// │ │Total Orders │ │Total Spent  │ │Pending      │                   │
// │ │     12      │ │  $249.99    │ │     2       │                   │
// │ └─────────────┘ └─────────────┘ └─────────────┘                   │
// ├────────────────────────────────────────────────────────────────────┤
// │ Order History                                                     │
// ├────────────────────────────────────────────────────────────────────┤
// │ Order #12345678 [COMPLETED]              $49.99                   │
// │ Jan 15, 2024                              [View order]            │
// │                                                                   │
// │ ┌─────────────────────────────────────────────────────────────┐  │
// │ │ Items                                                       │  │
// │ │ Inception x2                                    $49.99      │  │
// │ └─────────────────────────────────────────────────────────────┘  │
// │                                                                   │
// │ Order #87654321 [PENDING]               $29.99                    │
// │ Jan 10, 2024                              [View order]            │
// │                                                                   │
// └────────────────────────────────────────────────────────────────────┘
//
// Mobile View (narrow):
// ---------------------
// ┌─────────────────┐
// │ Welcome back    │
// │ Samir           │
// ├─────────────────┤
// │ Total Orders    │
// │      12         │
// ├─────────────────┤
// │ Total Spent     │
// │    $249.99      │
// ├─────────────────┤
// │ Pending Orders  │
// │      2          │
// ├─────────────────┤
// │ Order History   │
// ├─────────────────┤
// │ Order #12345678 │
// │ [COMPLETED]     │
// │ Jan 15, 2024    │
// │ $49.99          │
// │ [View order]    │
// └─────────────────┘
//
// ============================================================================
// POTENTIAL ISSUES & IMPROVEMENTS
// ============================================================================
//
// Issue 1: Placeholder user ID (CRITICAL!)
// -----------------------------------------
// Current: userId = "placeholder-user-id"
// Problem: This won't work in production - no real authentication
// Fix: Integrate with Better Auth session
//
// // Get real user ID from authentication
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// 
// const session = await auth.api.getSession({
//   headers: await headers(),
// });
// 
// if (!session) {
//   redirect("/auth/sign-in");
// }
// 
// const userId = session.user.id;
//
// Issue 2: Hardcoded user name "Samir"
// ------------------------------------
// Current: "Welcome back, Samir" - hardcoded
// Problem: Shows wrong name for different users
// Fix: Use session.user.name
//
// <h1>Welcome back, {session.user.name}</h1>
//
// Issue 3: No loading state for data fetching
// --------------------------------------------
// Problem: While fetching orders, user sees nothing (white screen)
// Fix: Add loading.tsx in dashboard folder
//
// Issue 4: No error handling for database failures
// -------------------------------------------------
// Problem: If database query fails, page crashes
// Fix: Add try/catch with error boundary
//
// Issue 5: StatusBadge uses custom cn() instead of shared utility
// ----------------------------------------------------------------
// Current: Local cn() function
// Problem: Duplicate code (should use @/lib/utils)
// Fix: import { cn } from "@/lib/utils"
//
// Issue 6: Inline styles use hardcoded colors
// --------------------------------------------
// Current: "bg-white", "text-gray-500", etc.
// Problem: Doesn't respect dark mode theme
// Fix: Use theme-aware classes: "bg-card", "text-muted-foreground"
//
// Issue 7: No pagination for large order history
// -----------------------------------------------
// Problem: If user has hundreds of orders, page will be huge
// Fix: Add pagination or infinite scroll
//
// Issue 8: Order details sheet might flicker
// -------------------------------------------
// Problem: Sheet opens/closes as URL changes (page reload)
// Fix: Use client-side navigation with router.push (already done)
//
// Issue 9: No order filtering or search
// --------------------------------------
// Problem: Can't search through orders or filter by status
// Fix: Add filter UI and update database query
//
// Issue 10: No real-time order updates
// -------------------------------------
// Problem: Order status doesn't update without page refresh
// Fix: Use WebSocket or polling for live updates
//
// ============================================================================
// IMPROVED VERSION EXAMPLE (With authentication and proper theming)
// ============================================================================
//
// import Link from "next/link";
// import { prisma } from "@/lib/prisma";
// import { Button } from "@/components/ui/button";
// import { MovieThumbnail } from "./_components/movie-thumbnail";
// import { OrderDetailsSheet } from "./_components/order-details";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { cn } from "@/lib/utils";
//
// export default async function DashboardPage({ 
//   searchParams 
// }: { 
//   searchParams: Promise<{ [key: string]: string | undefined }> 
// }) {
//   // Get authenticated user
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//
//   if (!session) {
//     redirect("/auth/sign-in?callbackUrl=/dashboard");
//   }
//
//   const params = await searchParams;
//   const selectedOrderId = params.order;
//   const userId = session.user.id;
//   const userName = session.user.name || "User";
//
//   // Fetch orders with error handling
//   let orders = [];
//   let error = null;
//   
//   try {
//     orders = await prisma.order.findMany({
//       where: { userId },
//       include: {
//         orderItems: {
//           include: {
//             movie: {
//               select: {
//                 id: true,
//                 title: true,
//                 imageUrl: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: { orderDate: "desc" },
//     });
//   } catch (err) {
//     console.error("Failed to fetch orders:", err);
//     error = "Unable to load order history. Please try again later.";
//   }
//
//   const selectedOrder = selectedOrderId 
//     ? orders.find(o => o.id === selectedOrderId) 
//     : null;
//
//   const totalOrders = orders.length;
//   const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
//   const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
//
//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-destructive">{error}</p>
//         <Button asChild className="mt-4">
//           <Link href="/dashboard">Try Again</Link>
//         </Button>
//       </div>
//     );
//   }
//
//   return (
//     <div className="space-y-8">
//       {/* Welcome Section - Dynamic user name */}
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight mb-2">
//           Welcome back, {userName}
//         </h1>
//         <p className="text-muted-foreground">
//           Here's what's happening with your movie collection.
//         </p>
//       </div>
//
//       {/* Statistics Cards - Theme-aware colors */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="rounded-lg border bg-card p-6">
//           <p className="text-sm text-muted-foreground">Total Orders</p>
//           <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
//         </div>
//         <div className="rounded-lg border bg-card p-6">
//           <p className="text-sm text-muted-foreground">Total Spent</p>
//           <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
//         </div>
//         <div className="rounded-lg border bg-card p-6">
//           <p className="text-sm text-muted-foreground">Pending Orders</p>
//           <p className="text-2xl font-bold text-foreground">{pendingOrders}</p>
//         </div>
//       </div>
//
//       {/* Order History Section - With pagination */}
//       <div className="rounded-lg border bg-card">
//         <div className="border-b p-6">
//           <h2 className="text-xl font-semibold">Order History</h2>
//         </div>
//
//         {/* Status Filter - Optional improvement */}
//         {/* <div className="flex gap-2 p-4 border-b">
//           <Button variant="outline" size="sm">All</Button>
//           <Button variant="outline" size="sm">Completed</Button>
//           <Button variant="outline" size="sm">Pending</Button>
//         </div> */}
//
//         {orders.length > 0 ? (
//           <div className="divide-y">
//             {orders.map((order) => (
//               <div key={order.id} className="space-y-4 p-6">
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                   <div>
//                     <div className="flex items-center gap-3">
//                       <span className="font-semibold">Order #{order.id.slice(-8)}</span>
//                       <StatusBadge status={order.status} />
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       {new Date(order.orderDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
//                     <Link 
//                       className="text-sm text-primary hover:underline" 
//                       href={`/dashboard?order=${order.id}`}
//                     >
//                       View order
//                     </Link>
//                   </div>
//                 </div>
//
//                 {selectedOrder?.id === order.id && (
//                   <div className="rounded border bg-muted/50 p-4">
//                     <p className="mb-3 text-sm font-semibold">Items</p>
//                     <ul className="space-y-2">
//                       {order.orderItems.map((item) => (
//                         <li key={item.id} className="flex items-center gap-3 text-sm">
//                           {item.movie.imageUrl ? (
//                             <MovieThumbnail 
//                               imageUrl={item.movie.imageUrl} 
//                               title={item.movie.title} 
//                             />
//                           ) : null}
//                           <span className="flex-1">
//                             {item.movie.title} x{item.quantity}
//                           </span>
//                           <span className="font-semibold">
//                             ${item.priceAtPurchase.toFixed(2)}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="py-12 text-center">
//             <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
//             <p className="mb-4 text-muted-foreground">
//               Start browsing our movie collection to make your first purchase
//             </p>
//             <Button asChild>
//               <Link href="/">Browse Movies</Link>
//             </Button>
//           </div>
//         )}
//       </div>
//       
//       <OrderDetailsSheet order={selectedOrder} />
//     </div>
//   );
// }
//
// function StatusBadge({ status }: { status: "PENDING" | "COMPLETED" | "CANCELLED" }) {
//   const variants = {
//     PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
//     COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
//     CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
//   }
//
//   return (
//     <span className={cn("px-2.5 py-0.5 text-xs font-medium rounded-full", variants[status])}>
//       {status}
//     </span>
//   )
// }
//
// ============================================================================
// ACCESSIBILITY CONSIDERATIONS
// ============================================================================
//
// Current features:
// -----------------
// - Semantic HTML (h1, h2 headings)
// - Proper heading hierarchy
// - Links have descriptive text ("View order", "Browse Movies")
//
// Missing features:
// -----------------
// - No ARIA labels for statistics cards (could be regions)
// - No "Loading" announcement for screen readers
// - No live region for dynamic content (expanded order items)
// - Status badges need aria-label for color meaning
//
// Improvements:
// -------------
// // Add aria-label to status badge
// <span aria-label={`Order status: ${status}`}>
//
// // Add role="region" to statistics cards
// <div role="region" aria-label="Order statistics">
//
// // Add live region for expanded items
// <div aria-live="polite">
//
// ============================================================================
// PERFORMANCE CONSIDERATIONS
// ============================================================================
//
// Good:
// -----
// - Server component (no client JS overhead)
// - Only fetches necessary fields (select in Prisma query)
// - Orders sorted on database side
// - Single database query with includes (not N+1)
// - Efficient reduce operations for statistics
//
// Potential optimizations:
// -------------------------
// 1. Add pagination for large order lists
// 2. Memoize statistics calculation if component becomes client component
// 3. Consider caching orders if they don't change often
// 4. Use React.memo for StatusBadge if re-renders become an issue
// 5. Lazy load OrderDetailsSheet (but it's already conditionally rendered)
//
// ============================================================================
```

This heavily commented version explains:
- **The complete dashboard flow** (fetching orders, calculating stats, rendering)
- **How URL state works** for opening/closing order details
- **The placeholder user ID issue** and how to fix with Better Auth
- **Each section's purpose** (welcome, stats, order history)
- **The difference between order list and expanded order items**
- **How the StatusBadge component works** with color mapping
- **Why we need proper authentication** (critical issue)
- **The relationship with OrderDetailsSheet** (controlled by URL)
- **Potential improvements** (pagination, filtering, real user data)
- **Accessibility and performance considerations**

Let me know if you'd like me to elaborate on any concept like the URL state management, Prisma query optimization, or how to properly integrate Better Auth with this dashboard!