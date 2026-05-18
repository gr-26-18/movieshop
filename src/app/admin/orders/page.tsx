import { getOrders } from '@/actions/admin-orders';
import OrderStatusSelect from './OrderStatusSelect';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Orders</h1>

      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Customer / ID</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(order.orderDate), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.shippingName || 'N/A'}</div>
                    <div className="text-xs text-slate-500 font-mono truncate max-w-[120px]" title={order.userId}>
                      {order.userId}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[200px] truncate" title={order.orderItems.map((item) => `${item.quantity}x ${item.movie.title}`).join(', ')}>
                    {order.orderItems.map((item) => `${item.quantity}x ${item.movie.title}`).join(', ')}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
