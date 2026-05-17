'use server';

import { cookies } from 'next/headers';

// MODIFIED: 2026-05-17 Added Zod validation for cart data integrity.
import { z } from 'zod';

export type CartItem = {
  id: string;
  quantity: number;
};

// NEW: Zod schema to validate cart item structure.
const cartItemSchema = z.object({
  id: z.string().min(1, 'Movie ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

// NEW: Zod schema to validate the full cart array.
const cartArraySchema = z.array(cartItemSchema);

// MODIFIED 2026-05-17: Added Zod validation to sanitize malformed cookie data.
export async function getCartCookies(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get('cart')?.value;
  if (!cartCookie) return [];
  try {
    const parsed = JSON.parse(cartCookie);
    // NEW: Validate parsed cart against Zod schema — silently drop invalid entries.
    const result = cartArraySchema.safeParse(parsed);
    return result.success ? result.data : [];
  } catch (e) {
    return [];
  }
}

// MODIFIED 2026-05-17: Added Zod validation before writing to cookie.
export async function setCartCookies(cart: CartItem[]) {
  // NEW: Validate cart before writing to cookie.
  const parsed = cartArraySchema.safeParse(cart);
  if (!parsed.success) {
    console.error('Invalid cart data — rejecting write:', parsed.error.flatten());
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set('cart', JSON.stringify(parsed.data), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'strict',
  });
}
