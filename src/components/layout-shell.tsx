'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
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
