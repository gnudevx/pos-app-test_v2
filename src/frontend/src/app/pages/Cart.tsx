import React, { useState, useEffect, useCallback } from 'react';
import { fetchCart, updateCartItemQuantity, removeCartItem, clearCart, checkoutCart, Cart as CartType, CartItem as CartItemType } from '../api/cart';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentCart = await fetchCart();
      setCart(currentCart);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Failed to load cart. Please try again.');
      setCart({ id: 'temp-cart-id', items: [], total_price: 0 }); // Fallback to empty cart
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItemQuantity(itemId, { quantity: newQuantity });
      loadCart(); // Reload cart to reflect changes and updated total
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update item quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      loadCart(); // Reload cart
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }
    try {
      await clearCart();
      loadCart(); // Reload cart, should be empty
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart. Please try again.');
    }
  };

  const handleCheckout = async () => {
    try {
      const result = await checkoutCart();
      setCheckoutMessage(`Checkout successful! Order ID: ${result.order_id}. Total: $${result.total_amount.toFixed(2)}`);
      setCart({ id: 'temp-cart-id', items: [], total_price: 0 }); // Clear cart locally after successful checkout
      loadCart(); // Ensure cart is empty from backend
    } catch (err) {
      console.error('Failed to checkout:', err);
      setError('Failed to checkout. Please try again.');
      setCheckoutMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  const hasItems = cart && cart.items.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Shopping Cart</h1>

        {checkoutMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {checkoutMessage}</span>
          </div>
        )}

        {!hasItems ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-xl">Your cart is empty.</p>
            <p className="text-gray-500 mt-2">Add some products to get started!</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {cart?.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Total:</h2>
              <p className="text-2xl font-bold text-gray-900">${cart?.total_price.toFixed(2)}</p>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleClearCart}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}