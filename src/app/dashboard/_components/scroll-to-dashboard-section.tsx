'use client';

// Added 2026-05-11 — scroll to order history when ?section=order-history.

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Scrolls to #order-history when the dashboard is opened with ?section=order-history.
 * Hash-only links are unreliable with Next.js client navigation on the same route.
 */
export function ScrollToDashboardSection() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section');

  useEffect(() => {
    if (section !== 'order-history') return;
    const el = document.getElementById('order-history');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [section]);

  return null;
}
