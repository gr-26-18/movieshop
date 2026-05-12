'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCartCookies, setCartCookies } from './cart';

export type CheckoutFormData = {
  shippingName: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export async function createOrder(data: CheckoutFormData) {
  let orderId: string;
  try {
    const cartItems = await getCartCookies();

    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    const movieIds = cartItems.map(item => item.id);
    const movies = await prisma.movie.findMany({
      where: {
        id: { in: movieIds }
      },
      select: {
        id: true,
        price: true,
      }
    });

    // Calculate total amount to ensure it is accurate based on DB prices
    let totalAmount = 0;
    const orderItemsData = cartItems.map(cartItem => {
      const movie = movies.find(m => m.id === cartItem.id);
      if (!movie) throw new Error(`Movie with ID ${cartItem.id} not found`);
      
      const itemTotal = movie.price * cartItem.quantity;
      totalAmount += itemTotal;

      return {
        movieId: movie.id,
        quantity: cartItem.quantity,
        priceAtPurchase: movie.price,
      };
    });

    // We use a mocked 'guest' userId until the auth team integrates Better Auth.
    const mockUserId = 'guest';

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: mockUserId,
        totalAmount,
        status: 'COMPLETED', // Or PENDING if payment is asynchronous
        shippingName: data.shippingName,
        addressLine1: data.addressLine1,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        orderItems: {
          create: orderItemsData
        }
      }
    });

    orderId = order.id;

    // Clear cart upon successful order creation
    await setCartCookies([]);

  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, error: 'Failed to process checkout. Please try again.' };
  }

  // Redirect outside the try/catch block
  redirect(`/checkout/success?orderId=${orderId}`);
}
