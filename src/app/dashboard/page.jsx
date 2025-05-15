"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatsCard from "@/component/StatsCard";
import TopStock from "@/component/TopStock";
import SearchBar from "@/component/SearchBar";

export default function DashboardPage() {
  const [totalStockPrice, setTotalStockPrice] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in by verifying token presence
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login"); // Redirect to login if no token
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch products data
        const productsRes = await fetch("/api/products", {
          headers: {
            Authorization: `Bearer ${token}`, // optional, if API requires token
          },
        });
        if (!productsRes.ok) throw new Error("Failed to fetch products");

        const products = await productsRes.json();
        const totalStock = products.reduce(
          (acc, product) => acc + product.Quantity * product.Price,
          0
        );
        setTotalStockPrice(totalStock);
        setTotalProducts(products.length);

        // Fetch sales data
        const salesRes = await fetch("/api/sells", {
          headers: {
            Authorization: `Bearer ${token}`, // optional
          },
        });
        if (!salesRes.ok) throw new Error("Failed to fetch sales");

        const sales = await salesRes.json();
        const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.TotalPrice, 0);
        setTotalSales(totalSalesAmount);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [router]);

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 cursor-pointer">
        <StatsCard
          title="Total Stock Price"
          value={`₹${totalStockPrice.toFixed(2)}`}
          onClick={() => handleNavigation("/View-All-Products")}
        />
        <StatsCard
          title="Number of Products"
          value={totalProducts}
          onClick={() => handleNavigation("/View-All-Products")}
        />
        <StatsCard
          title="Total Sales"
          value={`₹${totalSales.toFixed(2)}`}
          onClick={() => handleNavigation("/View-All-Sales")}
        />
      </div>
      <div className="grid-cols-1 md:grid-cols-1 gap-6">
        <TopStock />
      </div>
    </div>
  );
}
