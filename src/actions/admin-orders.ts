'use server';

import { prisma } from '@/lib/prisma';
import { isAdminUser } from '@/lib/admin-auth';

export async function getOrders() {
  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    throw new Error('Unauthorized');
  }

  return prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          movie: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    orderBy: { orderDate: 'desc' },
  });
}

export async function updateOrderStatus(orderId: string, status: 'PENDING' | 'COMPLETED' | 'CANCELLED') {
  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    throw new Error('Unauthorized');
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}
