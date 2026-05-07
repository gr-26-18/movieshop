'use server';

import { cookies } from 'next/headers';

export type CartItem = {
  id: string;
  quantity: number;
};

export async function getCartCookies(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get('cart')?.value;
  if (!cartCookie) return [];
  try {
    return JSON.parse(cartCookie);
  } catch (e) {
    return [];
  }
}

export async function setCartCookies(cart: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set('cart', JSON.stringify(cart), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'strict',
  });
}
