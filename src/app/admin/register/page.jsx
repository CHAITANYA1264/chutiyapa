"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterUserPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("User registered successfully!");
        setForm({ username: "", email: "", password: "", role: "user" });
      } else {
        setMessage(data.message || "Failed to register user.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Register New User</h2>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded"
          onChange={handleChange}
          value={form.username}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded"
          onChange={handleChange}
          value={form.email}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded"
          onChange={handleChange}
          value={form.password}
          required
        />
        <select
          name="role"
          className="w-full p-3 mb-6 border rounded"
          onChange={handleChange}
          value={form.role}
        >
          <option value="user">User</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          Register User
        </button>
      </form>
    </div>
  );
}
