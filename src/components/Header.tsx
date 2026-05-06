import Link from 'next/link';
import { Film, Search, ShoppingCart, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SearchInput from './SearchInput';

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
          <SearchInput />
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground rounded-full p-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Shopping Cart</span>
          </Button>
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-full p-2"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">User Account</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
