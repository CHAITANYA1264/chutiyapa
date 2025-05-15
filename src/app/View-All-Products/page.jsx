"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ViewAllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          headers: {
            Authorization: `Bearer ${token}`, // Optional if your API requires token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Stock Inventory</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left text-sm uppercase tracking-wider">
              <th className="p-4 border-b">Product Name</th>
              <th className="p-4 border-b">Quantity</th>
              <th className="p-4 border-b">Price</th>
              <th className="p-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition">
                <td className="p-4 border-b">{product.ProductName}</td>
                <td className="p-4 border-b">{product.Quantity}</td>
                <td className="p-4 border-b">₹{product.Price.toFixed(2)}</td>
                <td className="p-4 border-b">
                  ₹{(product.Quantity * product.Price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
