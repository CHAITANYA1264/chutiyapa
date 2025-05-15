"use client";

import { useEffect, useState } from 'react';

export default function SellProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantityToSell, setQuantityToSell] = useState('');
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    const matched = products.find(
      (p) => p.ProductName.toLowerCase() === value.toLowerCase()
    );

    if (matched) {
      setSelectedProduct(matched);
      setSuggestions([]);
    } else {
      const filtered = products.filter(p =>
        p.ProductName.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSuggestionClick = (product) => {
    setSelectedProduct(product);
    setSearch(product.ProductName);
    setSuggestions([]);
    setMessage('');
  };

  const handleSell = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantityToSell) return;

    try {
      const res = await fetch('/api/sells', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct._id,
          quantity: parseInt(quantityToSell)
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Sold ${quantityToSell} of ${selectedProduct.ProductName}`);
        setSelectedProduct(null);
        setSearch('');
        setQuantityToSell('');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sell Product</h2>

      <div className="mb-4 relative">
        <label htmlFor="search" className="block text-gray-700">Search Product</label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Type product name..."
          className="w-full p-3 border border-gray-300 rounded-lg mt-2"
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border w-full z-10 max-h-40 overflow-auto mt-1 rounded-md shadow">
            {suggestions.map((product) => (
              <li
                key={product._id}
                onClick={() => handleSuggestionClick(product)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {product.ProductName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedProduct && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Selected Product</h3>
          <p><strong>Name:</strong> {selectedProduct.ProductName}</p>
          <p><strong>Available:</strong> {selectedProduct.Quantity}</p>
          <p><strong>Price:</strong> ₹{selectedProduct.Price.toFixed(2)}</p>
        </div>
      )}

      {selectedProduct && (
        <form onSubmit={handleSell}>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity to Sell</label>
            <input
              type="number"
              min="1"
              max={selectedProduct.Quantity}
              value={quantityToSell}
              onChange={(e) => setQuantityToSell(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Confirm Sale
          </button>
        </form>
      )}

      {message && (
        <p className="mt-4 text-lg">{message}</p>
      )}
    </div>
  );
}
