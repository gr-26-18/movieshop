"use client";

// Added 2026-05-11 — route-aware dashboard breadcrumb labels.

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function getCurrentPageLabel(pathname: string): string {
  if (pathname.startsWith("/dashboard/help-support")) {
    return "Help & Support";
  }

  if (pathname.startsWith("/dashboard/settings")) {
    return "Settings";
  }

  return "Dashboard";
}

export function DashboardBreadcrumb() {
  const pathname = usePathname() ?? "/dashboard";
  const currentPageLabel = getCurrentPageLabel(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">{currentPageLabel}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
