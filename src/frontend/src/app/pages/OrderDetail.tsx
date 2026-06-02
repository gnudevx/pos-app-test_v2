import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderDetail, OrderDetail as OrderDetailType } from '../api/orders';
import useAuthStore from '../store/authStore';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { token } = useAuthStore();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Please log in to view order details.');
      setLoading(false);
      return;
    }
    if (!orderId) {
      setError('Order ID is missing.');
      setLoading(false);
      return;
    }

    const getOrderDetail = async () => {
      try {
        const data = await fetchOrderDetail(orderId, token);
        setOrder(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetail();
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <Link to="/orders" className="ml-4 text-blue-600 hover:text-blue-800 font-medium">
          Back to Order List
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-gray-700">Order not found.</p>
        <Link to="/orders" className="ml-4 text-blue-600 hover:text-blue-800 font-medium">
          Back to Order List
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Order ID:</p>
            <p className="text-lg font-semibold text-gray-900">{order.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Order Date:</p>
            <p className="text-lg font-semibold text-gray-900">{new Date(order.order_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status:</p>
            <p className="text-lg font-semibold text-gray-900">
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Amount:</p>
            <p className="text-lg font-semibold text-gray-900">${order.total_amount.toFixed(2)}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Items</h2>
        {order.items.length === 0 ? (
          <p className="text-gray-600">No items in this order.</p>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4">Product Name</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4">Quantity</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4">Price</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 pr-4 text-sm text-gray-800">{item.product_name}</td>
                    <td className="py-3 pr-4 text-sm text-gray-800">{item.quantity}</td>
                    <td className="py-3 pr-4 text-sm text-gray-800">${item.price.toFixed(2)}</td>
                    <td className="py-3 text-sm text-gray-800">${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link to="/orders" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          &larr; Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;