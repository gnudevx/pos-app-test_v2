
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInventory, InventoryItem } from '../api/inventory';

export default function InventoryListPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
      } catch (err) {
        setError('Failed to load inventory. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading inventory...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory Stock</h1>

        {inventory.length === 0 ? (
          <p className="text-gray-600">No inventory items found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4">Product ID</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4">Product Name</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4">Current Stock</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.product_id} className="border-t border-gray-200">
                    <td className="py-3 pr-4 text-gray-800">{item.product_id}</td>
                    <td className="py-3 pr-4 text-gray-800">{item.product_name}</td>
                    <td className="py-3 pr-4 text-gray-800">{item.current_stock}</td>
                    <td className="py-3">
                      <Link
                        to={`/inventory/adjust/${item.product_id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg text-sm"
                      >
                        Adjust Stock
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
}