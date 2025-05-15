"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // no token => redirect to login or set role to null
      setRole(null);
      router.push("/login");
      return;
    }

    // fetch role from API
    fetch("/api/user-role", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.role) {
          setRole(data.role);
        } else {
          // handle error or unauthorized
          setRole(null);
          router.push("/login");
        }
      })
      .catch(() => {
        setRole(null);
        router.push("/login");
      });
  }, [router]);

  const normalizedRole = role?.trim().toLowerCase();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  if (!role) return <div>Loading...</div>; // or skeleton/sidebar placeholder

  return (
    <aside className="w-45 bg-gray-300 shadow-md min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Stock Manager</h2>
      <nav className="space-y-4">
        <div
          onClick={() => handleNavigation("/dashboard")}
          className="block text-blue-600 hover:underline cursor-pointer"
        >
          Dashboard
        </div>

        <div
          onClick={() => handleNavigation("/View-All-Products")}
          className="block text-blue-600 hover:underline cursor-pointer"
        >
          View All Products
        </div>

        {(normalizedRole === "admin" || normalizedRole === "manager") && (
          <>
            <div
              onClick={() => handleNavigation("/Add-product")}
              className="block text-blue-600 hover:underline cursor-pointer"
            >
              Add Product
            </div>
            <div
              onClick={() => handleNavigation("/Update-Product")}
              className="block text-blue-600 hover:underline cursor-pointer"
            >
              Update Product
            </div>
            <div
              onClick={() => handleNavigation("/Delete-Product")}
              className="block text-blue-600 hover:underline cursor-pointer"
            >
              Delete Product
            </div>
          </>
        )}

        {(normalizedRole === "admin" || normalizedRole === "user") && (
          <div
            onClick={() => handleNavigation("/Sell-Product")}
            className="block text-blue-600 hover:underline cursor-pointer"
          >
            Sell Product
          </div>
        )}

        {(normalizedRole === "admin" ||
          normalizedRole === "manager" ||
          normalizedRole === "user") && (
          <div
            onClick={() => handleNavigation("/View-All-Sales")}
            className="block text-blue-600 hover:underline cursor-pointer"
          >
            View All Sales
          </div>
        )}

        {normalizedRole === "admin" && (
          <>
          <div
            onClick={() => handleNavigation("/admin/register")}
            className="block text-blue-600 hover:underline cursor-pointer"
          >
            Register User
          </div>
           <div
            onClick={() => handleNavigation("/admin/users")}
            className="block text-blue-600 hover:underline cursor-pointer"
          >
           User-Detail
          </div>
          </>
          
        )}

        <div
          onClick={handleLogout}
          className="block text-red-600 hover:underline cursor-pointer"
        >
          Logout
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
