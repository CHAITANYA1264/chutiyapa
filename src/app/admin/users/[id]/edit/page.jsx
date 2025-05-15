'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        setFormData({
          username: data.username || '',
          password: '', // Leave password empty, user must type new password to change
        });
        setLoading(false);
      } catch (err) {
        setError('Could not load user data');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');

    // Basic validation: username required, password optional (only changes if filled)
    if (!formData.username.trim()) {
      setError('Username cannot be empty');
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          ...(formData.password ? { password: formData.password } : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Update failed');
      }

      alert('User updated successfully!');
      router.push('/admin/users');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading user info...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">Edit User</h2>

      {error && (
        <p className="mb-4 text-red-600 font-medium">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium text-gray-700">
          Username
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md"
            required
          />
        </label>

        <label className="block mb-4 font-medium text-gray-700">
          Password (leave blank to keep current)
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md"
            autoComplete="new-password"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Update User
        </button>
      </form>
    </div>
  );
}
