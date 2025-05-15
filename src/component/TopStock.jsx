'use client';

import { useEffect, useState } from 'react';

const TopStockTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTopStock = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        // Sort the products by quantity (stock) in descending order
        const topProducts = data
          .sort((a, b) => b.Quantity - a.Quantity) // Assuming 'quantity' is the property
          .slice(0, 5); // Get the top 5 products

        setProducts(topProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchTopStock();
  }, []);

  return (
    <div className="max-w-8xl mx-auto bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Top 5 Stock Items</h2>

      {/* Top 5 Products Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left text-sm uppercase tracking-wider">
              <th className="p-4 border-b">#</th>
              <th className="p-4 border-b">Product Name</th>
              <th className="p-4 border-b">Quantity</th>
              <th className="p-4 border-b">Price</th>
              <th className="p-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {products.map((product, index) => (
              <tr key={product._id}className="hover:bg-gray-50 transition">
                <td className="p-4 border-b">{index + 1}</td>
                <td className="p-4 border-b">{product.ProductName}</td>
                <td className="p-4 border-b">{product.Quantity}</td> {/* Displaying quantity */}
                <td className="p-4 border-b">₹{product.Price?.toFixed(2) ?? '-'}</td>
                <td className="p-4 border-b">
                  {product.Price
                    ? `₹${(product.Quantity * product.Price).toFixed(2)}`
                    : '-'}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopStockTable;
