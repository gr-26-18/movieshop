'use server';

import { cookies } from 'next/headers';

import { z } from 'zod';

export type CartItem = {
  id: string;
  quantity: number;
};

const cartItemSchema = z.object({
  id: z.string().min(1, 'Movie ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

const cartArraySchema = z.array(cartItemSchema);

export async function getCartCookies(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get('cart')?.value;
  if (!cartCookie) return [];
  try {
    const parsed = JSON.parse(cartCookie);
    const result = cartArraySchema.safeParse(parsed);
    return result.success ? result.data : [];
  } catch (e) {
    return [];
  }
}

export async function setCartCookies(cart: CartItem[]) {
  const parsed = cartArraySchema.safeParse(cart);
  if (!parsed.success) {
    console.error('Invalid cart data:', parsed.error.flatten());
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set('cart', JSON.stringify(parsed.data), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'strict',
  });
}
