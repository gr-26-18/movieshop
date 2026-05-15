import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  return (
    <main className="container mx-auto py-24 px-4 max-w-2xl text-center">
      <div className="flex justify-center mb-8">
        <CheckCircle className="w-24 h-24 text-green-500" />
      </div>
      
      <h1 className="text-4xl font-extrabold mb-4">Order Confirmed!</h1>
      <p className="text-xl text-slate-600 mb-8">
        Thank you for your purchase. Your payment was successful and your order is being processed.
      </p>

      {orderId && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 inline-block">
          <p className="text-sm text-slate-500 mb-1">Order Reference ID</p>
          <p className="font-mono text-lg font-bold">#{orderId.slice(-8)}</p>
        </div>
      )}

      <div>
        <Link href="/">
          <Button size="lg" className="h-12 px-8 text-base">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </main>
  );
}
