'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Added 2026-05-05:
// Centralized route-aware shell to avoid header/footer inconsistencies
// during client-side navigation between public and admin/dashboard areas.
export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
  // Added 2026-05-05:
  // Hide global Header/Footer in app-like sections that already have their own layout chrome.
  const isDashboardOrAdmin =
    pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <>
      {!isDashboardOrAdmin && <Header />}
      <div className="flex-1">{children}</div>
      {!isDashboardOrAdmin && <Footer />}
    </>
  );
}
