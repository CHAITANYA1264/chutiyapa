"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ViewAllSalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchSales = async () => {
      try {
        const response = await fetch("/api/sells", {
          headers: { Authorization: `Bearer ${token}` }, // optional, if your API requires it
        });
        if (!response.ok) {
          throw new Error("Failed to fetch sales");
        }

        const data = await response.json();
        setSales(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSales();
  }, [router]);

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toISOString().split("T")[0]; // yyyy-MM-dd
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Sales Report</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left text-sm uppercase tracking-wider">
              <th className="p-4 border-b">Product Name</th>
              <th className="p-4 border-b">Quantity Sold</th>
              <th className="p-4 border-b">Price Per Unit</th>
              <th className="p-4 border-b">Total Price</th>
              <th className="p-4 border-b">Date of Sale</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {sales.map((sale) => (
              <tr key={sale._id} className="hover:bg-gray-50 transition">
                <td className="p-4 border-b">{sale.ProductName}</td>
                <td className="p-4 border-b">{sale.QuantitySold}</td>
                <td className="p-4 border-b">₹{sale.PricePerUnit.toFixed(2)}</td>
                <td className="p-4 border-b">₹{sale.TotalPrice.toFixed(2)}</td>
                <td className="p-4 border-b">{formatDate(sale.DateSold)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
