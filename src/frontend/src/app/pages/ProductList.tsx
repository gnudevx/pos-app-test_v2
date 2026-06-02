
import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct, Product } from '../api/products';
import { Link, useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-700">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Catalog</h1>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            to="/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Add New Product
          </Link>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-600 text-center">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pt-4 px-4 rounded-tl-lg">ID</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pt-4 px-4">Name</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pt-4 px-4">Price</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pt-4 px-4">Stock</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 pt-4 px-4 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{product.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <Link to={`/products/${product.id}`} className="text-blue-600 hover:underline">
                        {product.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{product.stock}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 flex space-x-2">
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
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