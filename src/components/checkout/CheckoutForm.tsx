'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/actions/checkout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const checkoutSchema = z.object({
  shippingName: z.string().min(1, 'Name is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP Code is required'),
  country: z.string().min(1, 'Country is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingName: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Create the order using the server action
      const result = await createOrder({
        shippingName: data.shippingName,
        addressLine1: data.addressLine1,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      });

      // If we reach here, there was an error returned from the server action
      if (result && result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      if (err?.message === 'NEXT_REDIRECT' || err?.digest?.startsWith('NEXT_REDIRECT')) {
        // Clear local cart context before navigation (the server cookie is already cleared)
        clearCart();
        throw err;
      }
      setError('An unexpected error occurred. Please try again.');
    } finally {
      // If we redirect, this component unmounts, but finally runs. 
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Shipping Address Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">1. Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shippingName">Full Name</Label>
            <Input id="shippingName" placeholder="John Doe" {...register('shippingName')} />
            {errors.shippingName && <p className="text-red-500 text-sm">{errors.shippingName.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="addressLine1">Address</Label>
            <Input id="addressLine1" placeholder="123 Main St" {...register('addressLine1')} />
            {errors.addressLine1 && <p className="text-red-500 text-sm">{errors.addressLine1.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="New York" {...register('city')} />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" placeholder="NY" {...register('state')} />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input id="zipCode" placeholder="10001" {...register('zipCode')} />
            {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" placeholder="United States" {...register('country')} />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>
        </div>
      </section>

      {/* Payment Details Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">2. Payment Details</h2>
        <div className="bg-slate-50 p-4 rounded-xl border mb-4">
          <p className="text-sm text-slate-600 mb-4">
            This is a simulated payment. No real charges will be made.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234567812345678" {...register('cardNumber')} maxLength={16} />
              {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry (MM/YY)</Label>
              <Input id="expiry" placeholder="12/25" {...register('expiry')} maxLength={5} />
              {errors.expiry && <p className="text-red-500 text-sm">{errors.expiry.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" {...register('cvv')} maxLength={4} type="password" />
              {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv.message}</p>}
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full h-12 text-lg" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </Button>
    </form>
  );
}
