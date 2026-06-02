import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders, Order } from '../api/orders';
import useAuthStore from '../store/authStore';

const OrderListPage: React.FC = () => {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Please log in to view orders.');
      setLoading(false);
      return;
    }

    const getOrders = async () => {
      try {
        const data = await fetchOrders(token);
        setOrders(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4">Order ID</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4">Date</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4">Total</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4">Status</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 pr-4 text-sm text-gray-800">{order.id}</td>
                    <td className="py-3 pr-4 text-sm text-gray-800">{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="py-3 pr-4 text-sm text-gray-800">${order.total_amount.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-sm text-gray-800">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;