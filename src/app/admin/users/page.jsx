'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const checkRoleAndFetch = async () => {
      const roleRes = await fetch('/api/user-role', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!roleRes.ok) return router.push('/login');

      const { role } = await roleRes.json();
      if (role !== 'admin') return router.push('/not-authorized');
      setIsAdmin(true);

      const userRes = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await userRes.json();
      setUsers(data);
    };

    checkRoleAndFetch();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure to delete this user?");
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setUsers(users.filter(user => user._id !== id));
    } else {
      alert('Delete failed.');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Users</h2>
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b">Email</th>
            <th className="p-3 border-b">Username</th>
            <th className="p-3 border-b">Role</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="p-3 border-b">{user.email}</td>
              <td className="p-3 border-b">{user.username || '-'}</td>
              <td className="p-3 border-b capitalize">{user.role}</td>
              <td className="p-3 border-b space-x-3">
                <button
                  className="text-yellow-600 hover:underline"
                  onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                >
                  Edit
                </button>
                {user.role !== 'admin' && (
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td className="p-3 text-gray-500" colSpan="4">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
