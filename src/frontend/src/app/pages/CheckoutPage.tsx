
import React, { useState, useEffect } from 'react';
import { processCheckout } from '../api/checkout';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Mock fetching cart items. In a real app, this would come from a global state, context, or an API call.
    const mockCartItems: CartItem[] = [
      { id: 'prod1', name: 'Laptop', price: 1200.00, quantity: 1 },
      { id: 'prod2', name: 'Mouse', price: 25.00, quantity: 2 },
      { id: 'prod3', name: 'Keyboard', price: 75.00, quantity: 1 },
    ];
    setCartItems(mockCartItems);
    const calculatedTotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(calculatedTotal);
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setCheckoutSuccess(false);
    try {
      const result = await processCheckout();
      console.log('Checkout successful:', result);
      setCheckoutSuccess(true);
      // Optionally clear cart or redirect to order history
      setCartItems([]);
      setTotal(0);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Checkout</h1>

        {checkoutSuccess ? (
          <div className="text-center text-green-600 font-semibold text-lg">
            <p>Your order has been placed successfully!</p>
            <p className="mt-2">Thank you for your purchase.</p>
            <button
              onClick={() => setCheckoutSuccess(false)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {cartItems.length === 0 && !loading && !error ? (
              <p className="text-center text-gray-600 text-lg">Your cart is empty.</p>
            ) : (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
                <table className="w-full border-collapse mb-4">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-sm font-semibold text-gray-600 pb-3">Product</th>
                      <th className="text-right text-sm font-semibold text-gray-600 pb-3">Quantity</th>
                      <th className="text-right text-sm font-semibold text-gray-600 pb-3">Price</th>
                      <th className="text-right text-sm font-semibold text-gray-600 pb-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-3 text-gray-800">{item.name}</td>
                        <td className="py-3 text-right text-gray-800">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-800">${item.price.toFixed(2)}</td>
                        <td className="py-3 text-right text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end items-center pt-4 border-t border-gray-200">
                  <span className="text-xl font-bold text-gray-800 mr-4">Total:</span>
                  <span className="text-2xl font-extrabold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg transition duration-200
                ${loading || cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                }`}
            >
              {loading ? 'Processing...' : 'Finalize Checkout'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}