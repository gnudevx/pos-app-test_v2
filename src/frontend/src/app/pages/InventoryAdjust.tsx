
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInventory, adjustStock, InventoryItem } from '../api/inventory';

export default function InventoryAdjustPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<InventoryItem | null>(null);
  const [quantityChange, setQuantityChange] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const allInventory = await getInventory();
        const foundProduct = allInventory.find(
          (item) => item.product_id === parseInt(productId, 10)
        );
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Failed to load product details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !productId) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProduct = await adjustStock(product.product_id, { quantity_change: quantityChange });
      setProduct(updatedProduct); // Update local state with new stock
      setSuccess(`Stock for ${updatedProduct.product_name} adjusted successfully! New stock: ${updatedProduct.current_stock}`);
      setQuantityChange(0); // Reset input
    } catch (err) {
      setError('Failed to adjust stock. Please check the value and try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading product details...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
        <button
          onClick={() => navigate('/inventory')}
          className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-gray-700">Product not found.</p>
        <button
          onClick={() => navigate('/inventory')}
          className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Adjust Stock for {product.product_name}</h1>

        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Product ID:</span> {product.product_id}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Current Stock:</span> {product.current_stock}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantityChange" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Change (e.g., 10 for add, -5 for remove)
            </label>
            <input
              type="number"
              id="quantityChange"
              value={quantityChange}
              onChange={(e) => setQuantityChange(parseInt(e.target.value, 10) || 0)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adjusting...' : 'Adjust Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}