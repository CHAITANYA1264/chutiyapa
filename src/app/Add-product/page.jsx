"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [form, setForm] = useState({ name: "", stock: "", price: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/user-role", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && (data.role === "admin" || data.role === "manager")) {
          setIsAuthorized(true);
        } else {
          setErrorMessage("Access denied. Only admin or manager can add products.");
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setErrorMessage("Error verifying user. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ProductName: form.name,
          Quantity: Number(form.stock),
          Price: parseFloat(form.price),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Product added successfully!");
        setForm({ name: "", stock: "", price: "" });
      } else {
        setErrorMessage(data.message || "Failed to add product.");
      }
    } catch (err) {
      console.error("Add product error:", err);
      setErrorMessage("Server error. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-red-600 font-semibold">
        {errorMessage || "Access Denied"}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Product</h2>

      {successMessage && (
        <p className="mb-4 text-green-600 font-medium">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mb-4 text-red-600 font-medium">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="block text-gray-700">Stock Quantity</label>
          <input
            type="number"
            id="stock"
            name="stock"
            placeholder="Enter quantity"
            value={form.stock}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            required
            min="0"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="price" className="block text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Enter price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
