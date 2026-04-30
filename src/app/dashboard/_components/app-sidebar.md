Here's your AppSidebar component with thorough, educational comments explaining every step:

```typescript
// ============================================================================
// APP SIDEBAR - Navigation Sidebar Component (shadcn/ui)
// ============================================================================
// This is a client component that renders a collapsible sidebar navigation
// It uses shadcn/ui Sidebar components for structure and styling
// Includes main navigation, secondary navigation, and user profile section
// The sidebar can be collapsed to an icon-only version (collapsible="icon")
// ============================================================================

// ----------------------------------------------------------------------------
// DIRECTIVE: "USE CLIENT"
// ----------------------------------------------------------------------------
// "use client" marks this as a Client Component (runs in the browser)
// Required because this component:
// - Uses client-side navigation (Link from next/link)
// - Has interactivity (sidebar can be collapsed/expanded)
// - Uses React hooks (implicitly through shadcn sidebar components)
"use client"

// ----------------------------------------------------------------------------
// REACT IMPORTS
// ----------------------------------------------------------------------------
// Import React namespace for JSX and React types
// The * as React imports everything from React (common pattern for components)
import * as React from "react"

// ----------------------------------------------------------------------------
// ICON IMPORTS (Lucide React)
// ----------------------------------------------------------------------------
// Import specific icons from Lucide React library
// Lucide provides beautiful, consistent SVG icons
import {
  LayoutDashboard,  // Dashboard/home icon (house/grid)
  Film,             // Movie icon (clapperboard/film strip)
  Settings,         // Gear/settings icon
  HelpCircle,       // Question mark in circle (help/support)
  LogOut,           // Door with arrow (sign out)
  User,             // Person silhouette (user profile)
  ShoppingBag,      // Shopping bag (e-commerce/store)
} from "lucide-react"

// ----------------------------------------------------------------------------
// NEXT.JS IMPORTS
// ----------------------------------------------------------------------------
// Import Next.js Link component for client-side navigation
// Link enables SPA-style navigation without full page reloads
// Automatically prefetches linked pages in the background
import Link from "next/link"

// ----------------------------------------------------------------------------
// SHADCN/UI SIDEBAR COMPONENTS
// ----------------------------------------------------------------------------
// Import all sidebar components from shadcn/ui library
// These components provide a fully accessible, styled sidebar structure
import {
  Sidebar,                  // Main sidebar container
  SidebarContent,           // Scrollable content area of sidebar
  SidebarFooter,            // Bottom section of sidebar (user profile, etc.)
  SidebarGroup,             // Group of related navigation items
  SidebarGroupContent,      // Content container within a group
  SidebarGroupLabel,        // Label/title for a group (e.g., "Main Menu")
  SidebarHeader,            // Top section of sidebar (logo, branding)
  SidebarMenu,              // Menu container (list of navigation items)
  SidebarMenuButton,        // Styled button for each menu item
  SidebarMenuItem,          // Individual menu item wrapper (li element)
  SidebarRail,              // Small rail on the edge for collapsing/expanding
} from "@/components/ui/sidebar"

// ============================================================================
// NAVIGATION DATA (Configuration)
// ============================================================================
// This object defines the structure and content of the sidebar
// Separating data from UI makes it easier to maintain and update
const data = {
  // Main navigation items (primary navigation)
  navMain: [
    {
      title: "Overview",        // Display text for the menu item
      url: "/dashboard",        // URL to navigate to when clicked
      icon: LayoutDashboard,    // Icon component to display
      isActive: true,           // Indicates current active page (highlights this item)
    },
    {
      title: "My Movies",
      url: "/dashboard",        // Note: Both point to same URL (might need fixing)
      icon: Film,
      // isActive is omitted (defaults to false/undefined)
    },
    {
      title: "Shop",
      url: "/",                 // Home page URL
      icon: ShoppingBag,
    },
  ],
  
  // Secondary navigation items (appear at bottom of sidebar)
  navSecondary: [
    {
      title: "Settings",
      url: "#",                 // Placeholder URL (not implemented yet)
      icon: Settings,
    },
    {
      title: "Help & Support",
      url: "#",                 // Placeholder URL (not implemented yet)
      icon: HelpCircle,
    },
  ],
}

// ============================================================================
// APP SIDEBAR COMPONENT
// ============================================================================
// This component renders the complete sidebar navigation
// It accepts all props that the shadcn Sidebar component accepts
// The collapsible="icon" prop allows the sidebar to collapse to just icons
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // --------------------------------------------------------------------------
  // COMPONENT RENDER
  // --------------------------------------------------------------------------
  return (
    // ------------------------------------------------------------------------
    // SIDEBAR CONTAINER
    // ------------------------------------------------------------------------
    // Sidebar is the main container component
    // collapsible="icon": Allows sidebar to collapse to icon-only mode
    // ...props spreads all additional props (className, etc.)
    <Sidebar collapsible="icon" {...props}>
      
      {/* -------------------------------------------------------------- */}
      {/* SIDEBAR HEADER - Logo and Branding Section */}
      {/* -------------------------------------------------------------- */}
      <SidebarHeader>
        {/* SidebarMenu provides the list structure for menu items */}
        <SidebarMenu>
          {/* SidebarMenuItem represents a single menu item (li element) */}
          <SidebarMenuItem>
            {/* 
              SidebarMenuButton is the clickable element for the menu item
              size="lg": Large size (more padding, larger text)
              asChild: Renders as its child component (Link) instead of a button
              This allows us to use Next.js Link for navigation
            */}
            <SidebarMenuButton size="lg" asChild>
              {/* 
                Next.js Link component for client-side navigation
                href="/": Navigates to home page when logo is clicked
              */}
              <Link href="/">
                {/* Logo icon container - square box with background color */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  {/* Film icon representing movie shop branding */}
                  <Film className="size-4" />
                </div>
                
                {/* Branding text container */}
                <div className="flex flex-col gap-0.5 leading-none">
                  {/* App name - bold and prominent */}
                  <span className="font-semibold">MovieShop</span>
                  {/* App version/edition - muted and smaller */}
                  <span className="text-xs text-muted-foreground">Premium v1.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      {/* -------------------------------------------------------------- */}
      {/* SIDEBAR CONTENT - Scrollable Navigation Area */}
      {/* -------------------------------------------------------------- */}
      <SidebarContent>
        
        {/* ------------------------------------------------------------ */}
        {/* MAIN MENU GROUP */}
        {/* ------------------------------------------------------------ */}
        {/* SidebarGroup groups related navigation items together */}
        <SidebarGroup>
          {/* Group label - "Main Menu" heading */}
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          
          {/* Content container for the group */}
          <SidebarGroupContent>
            {/* SidebarMenu is the actual list of navigation items */}
            <SidebarMenu>
              {/* Map through main navigation items and render each */}
              {data.navMain.map((item) => (
                // Each menu item needs a unique key for React reconciliation
                <SidebarMenuItem key={item.title}>
                  {/* 
                    SidebarMenuButton for each navigation item
                    asChild: Renders as Link component for navigation
                    tooltip={item.title}: Shows tooltip when sidebar is collapsed
                    isActive={item.isActive}: Highlights the active page
                  */}
                  <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                    {/* Next.js Link for navigation to the item's URL */}
                    <Link href={item.url}>
                      {/* Render the icon component (e.g., LayoutDashboard) */}
                      <item.icon />
                      {/* Display the menu item text */}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* ------------------------------------------------------------ */}
        {/* SECONDARY MENU GROUP (Pushed to bottom) */}
        {/* ------------------------------------------------------------ */}
        {/* 
          className="mt-auto": margin-top auto pushes this group to the bottom
          This ensures secondary navigation always appears at the bottom of sidebar
          regardless of how many main navigation items there are
        */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Map through secondary navigation items */}
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* 
                    size="sm": Smaller button size for secondary items
                    asChild: Renders as Link component
                    tooltip: Shows tooltip on hover when sidebar collapsed
                  */}
                  <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* -------------------------------------------------------------- */}
      {/* SIDEBAR FOOTER - User Profile Section */}
      {/* -------------------------------------------------------------- */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* User profile button - shows current user info and logout */}
            <SidebarMenuButton size="lg" asChild>
              {/* 
                Using div instead of Link because this section isn't navigational
                The entire div is clickable (but currently no onClick handler)
                TODO: Add logout functionality to LogOut icon
              */}
              <div className="flex items-center gap-3 px-1">
                {/* User avatar placeholder */}
                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                  <User className="size-4" />
                </div>
                
                {/* User info container */}
                <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
                  {/* User name - truncated if too long */}
                  <span className="font-medium truncate text-sm">Samir</span>
                  {/* User email - truncated if too long */}
                  <span className="text-xs text-muted-foreground truncate">samir@example.com</span>
                </div>
                
                {/* Logout icon - appears on the right side */}
                {/* 
                  ml-auto: margin-left auto pushes this to the far right
                  TODO: Make this clickable to actually sign out
                */}
                <LogOut className="ml-auto size-4 text-muted-foreground" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      {/* -------------------------------------------------------------- */}
      {/* SIDEBAR RAIL - Collapse/Expand Handle */}
      {/* -------------------------------------------------------------- */}
      {/* 
        SidebarRail creates a small vertical bar on the edge of the sidebar
        Users can click/tap this rail to collapse or expand the sidebar
        When collapsed, only icons are shown (text is hidden)
        When expanded, both icons and text are shown
      */}
      <SidebarRail />
    </Sidebar>
  )
}

// ============================================================================
// SIDEBAR BEHAVIOR EXPLANATION
// ============================================================================
//
// Collapsible Sidebar Modes:
// --------------------------
// 1. Expanded State (default):
//    ┌──────────────────────┐
//    │ 🎬 MovieShop Premium │
//    │ ─────────────────────│
//    │ 📊 Overview          │
//    │ 🎬 My Movies         │
//    │ 🛒 Shop              │
//    │ ─────────────────────│
//    │ ⚙️ Settings          │
//    │ ❓ Help & Support    │
//    │ ─────────────────────│
//    │ 👤 Samir             │
//    │    samir@example.com │
//    └──────────────────────┘
//
// 2. Collapsed State (icon-only):
//    ┌────┐
//    │ 🎬 │
//    │ ── │
//    │ 📊 │
//    │ 🎬 │
//    │ 🛒 │
//    │ ── │
//    │ ⚙️ │
//    │ ❓ │
//    │ ── │
//    │ 👤 │
//    └────┘
//
// ============================================================================
// VISUAL HIERARCHY EXPLANATION
// ============================================================================
//
// Component Tree Structure:
// -------------------------
// Sidebar (collapsible="icon")
//   ├── SidebarHeader
//   │   └── SidebarMenu
//   │       └── SidebarMenuItem
//   │           └── SidebarMenuButton (Logo + Brand)
//   ├── SidebarContent
//   │   ├── SidebarGroup (Main Menu)
//   │   │   ├── SidebarGroupLabel ("Main Menu")
//   │   │   └── SidebarGroupContent
//   │   │       └── SidebarMenu
//   │   │           └── SidebarMenuItem[] (Overview, My Movies, Shop)
//   │   └── SidebarGroup (Secondary Menu - mt-auto)
//   │       └── SidebarGroupContent
//   │           └── SidebarMenu
//   │               └── SidebarMenuItem[] (Settings, Help)
//   ├── SidebarFooter
//   │   └── SidebarMenu
//   │       └── SidebarMenuItem
//   │           └── SidebarMenuButton (User Profile + Logout)
//   └── SidebarRail
//
// ============================================================================
// STYLING CLASSES EXPLANATION
// ============================================================================
//
// Layout Classes:
// ---------------
// mt-auto: Margin-top auto - pushes element to bottom of flex container
// ml-auto: Margin-left auto - pushes element to right of flex container
// gap-0.5: Gap of 0.125rem (2px) between flex children
// gap-3: Gap of 0.75rem (12px)
// px-1: Padding left/right of 0.25rem (4px)
//
// Sizing Classes:
// ---------------
// size-8: Width and height of 2rem (32px)
// size-4: Width and height of 1rem (16px)
// w-full: Full width
//
// Visual Classes:
// ---------------
// rounded-lg: Border radius of 0.5rem (8px)
// rounded-full: Border radius of 9999px (perfect circle)
// bg-primary: Background color from theme (primary color)
// text-primary-foreground: Text color that contrasts with primary
// bg-muted: Muted background color for avatar
// text-muted-foreground: Muted text color
// font-semibold: Semibold font weight (600)
// font-medium: Medium font weight (500)
// truncate: Truncate text with ellipsis if too long
// text-xs: Extra small text size (0.75rem / 12px)
// text-sm: Small text size (0.875rem / 14px)
//
// Flexbox Classes:
// ----------------
// flex: Display as flexbox
// items-center: Align items vertically center
// justify-center: Justify content horizontally center
// flex-col: Flex direction column (vertical layout)
// aspect-square: Maintain 1:1 aspect ratio
//
// ============================================================================
// POTENTIAL IMPROVEMENTS & FIXES
// ============================================================================
//
// Issue 1: Both "Overview" and "My Movies" point to "/dashboard"
// ----------------------------------------------------------------
// Problem: Two different menu items go to same page
// Fix: Update "My Movies" URL to something like "/dashboard/movies"
//
// Issue 2: Logout icon doesn't have sign out functionality
// ---------------------------------------------------------
// Problem: Clicking LogOut icon doesn't sign user out
// Fix: Wrap logout section with actual logout handler
//
// // Instead of div, use button with onClick
// <SidebarMenuButton size="lg" onClick={handleLogout}>
//   <div className="flex items-center gap-3 px-1">
//     <User className="size-4" />
//     <div>...</div>
//     <LogOut className="ml-auto size-4" />
//   </div>
// </SidebarMenuButton>
//
// Issue 3: User data is hardcoded ("Samir")
// ------------------------------------------
// Problem: User name and email are static
// Fix: Get user data from session
//
// const session = await auth.api.getSession({ headers: await headers() });
// const userName = session?.user?.name || "User";
// const userEmail = session?.user?.email || "";
//
// Issue 4: Settings and Help have placeholder URLs ("#")
// -------------------------------------------------------
// Problem: Links don't go anywhere
// Fix: Create actual pages or remove if not needed
//
// Issue 5: No active state highlighting for current page
// --------------------------------------------------------
// Problem: isActive is hardcoded for "Overview" only
// Fix: Use pathname from usePathname() hook to determine active page
//
// "use client";
// import { usePathname } from "next/navigation";
// 
// const pathname = usePathname();
// const isActive = pathname === item.url;
//
// ============================================================================
// ACCESSIBILITY FEATURES
// ============================================================================
//
// Built-in features from shadcn Sidebar:
// ---------------------------------------
// - Proper ARIA labels for navigation regions
// - Keyboard navigation support (Tab, Enter, Space)
// - Focus indicators for keyboard users
// - Screen reader announcements for collapse/expand
// - Tooltips on icon-only mode for screen readers
//
// Additional improvements:
// ------------------------
// // Add aria-label for user section
// <div aria-label="User menu">
//
// // Add aria-current="page" for active link
// <Link href={item.url} aria-current={isActive ? "page" : undefined}>
//
// ============================================================================
// RELATED COMPONENTS
// ============================================================================
//
// This sidebar works with:
// -------------------------
// - AppLayout: Wraps page with sidebar + main content
// - Navbar: Top navigation bar (may be hidden when sidebar is present)
// - DashboardPage: Main content area that this sidebar navigates to
// - SignOutButton: For the logout functionality
//
// Example layout using this sidebar:
// -----------------------------------
// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex h-screen">
//       <AppSidebar />
//       <main className="flex-1 overflow-auto">
//         {children}
//       </main>
//     </div>
//   );
// }
//
// ============================================================================
```

This heavily commented version explains:
- **What each shadcn sidebar component does** (Sidebar, SidebarContent, SidebarFooter, etc.)
- **How the collapsible sidebar works** (expanded vs icon-only states)
- **The data structure** separating navigation config from UI
- **Styling classes** (Tailwind CSS classes explained)
- **Why mt-auto pushes secondary menu to bottom**
- **How the SidebarRail enables collapse/expand functionality**
- **Potential issues** like hardcoded user data and placeholder URLs
- **How to add active state highlighting** with usePathname
- **Accessibility features** built into shadcn sidebar
- **Related components** and how to use this in a layout

Let me know if you'd like me to elaborate on any concept like the collapsible sidebar behavior, the shadcn component composition pattern, or how to integrate authentication with the user profile section!