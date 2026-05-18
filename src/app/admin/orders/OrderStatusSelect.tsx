'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/actions/admin-orders';
import { useRouter } from 'next/navigation';

export default function OrderStatusSelect({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'PENDING' | 'COMPLETED' | 'CANCELLED';
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={initialStatus}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className="p-1 border rounded text-sm bg-white min-w-[100px]"
    >
      <option value="PENDING">Pending</option>
      <option value="COMPLETED">Completed</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}
