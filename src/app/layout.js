"use client";

import "./globals.css";
import { useAuth } from "./context/AuthContext"; // Adjust the path as needed
import { AuthProvider } from "./context/AuthContext";
import { usePathname } from "next/navigation";

import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";

function LayoutContent({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null; // Wait for auth check to complete

  const hideSidebarRoutes = ["/login"];
  const shouldShowSidebar = isLoggedIn && !hideSidebarRoutes.includes(pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navbar />
      </div>
      <div className="flex">
        {shouldShowSidebar && <Sidebar />}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
