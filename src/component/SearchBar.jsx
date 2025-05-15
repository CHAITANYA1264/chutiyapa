'use client';

import { useEffect, useState } from 'react';

const SearchProductPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
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
      setNotFound(false);
      setSuggestions([]);
    } else {
      setSelectedProduct(null);
      if (value.trim()) {
        setSuggestions(
          products.filter((p) =>
            p.ProductName.toLowerCase().includes(value.toLowerCase())
          )
        );
        setNotFound(true);
      } else {
        setSuggestions([]);
        setNotFound(false);
      }
    }
  };

  const handleSuggestionClick = (product) => {
    setSelectedProduct(product);
    setSearch(product.ProductName);
    setSuggestions([]);
    setNotFound(false);
  };

  return (
    <div className="max-w-full mx-auto bg-white shadow-xl rounded-2xl p-3">
      <div className="mb-1 relative">
        <input
          type="text"
          id="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search Product"
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
        {notFound && suggestions.length === 0 && (
          <p className="text-red-500 mt-2">Product not found</p>
        )}
      </div>

      {/* Show Product Info in Table */}
      {selectedProduct && (
        <div className="mb-4 border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Product Details</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Name</th>
                <th className="border-b p-2">Quantity</th>
                <th className="border-b p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b p-2">{selectedProduct.ProductName}</td>
                <td className="border-b p-2">{selectedProduct.Quantity}</td>
                <td className="border-b p-2">₹{selectedProduct.Price.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchProductPage;
