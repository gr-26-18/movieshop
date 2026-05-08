import Link from 'next/link';
import { Film, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import SearchInput from './SearchInput';
import CartIcon from './cart/CartIcon';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left Section: Logo & Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-7 w-7 text-indigo-600" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              MovieShop
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Browse
            </Link>
            <Link
              href="/admin"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              Admin
            </Link>
          </nav>
        </div>

        {/* Center Section: Search */}
        <div className="flex-1 max-w-2xl px-6 hidden md:block">
          <Suspense
            fallback={<div className="h-9 w-full rounded-full bg-slate-100" />}
          >
            <SearchInput />
          </Suspense>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4">
          <CartIcon />
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <User className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
