import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-12 py-10 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-extrabold text-xl tracking-tight mb-4">MovieShop</h3>
          <p className="text-sm text-muted-foreground">
            Your premium destination for the finest digital movie copies.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground transition-colors">Browse Movies</Link></li>
            <li><Link href="/" className="hover:text-foreground transition-colors">New Releases</Link></li>
            <li><Link href="/" className="hover:text-foreground transition-colors">Best Deals</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/dashboard" className="hover:text-foreground transition-colors">My Profile</Link></li>
            <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Order History</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} MovieShop. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed for movie lovers.</p>
      </div>
    </footer>
  );
}
