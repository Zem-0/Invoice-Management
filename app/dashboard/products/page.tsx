"use client";

import React, { useState } from "react";

interface Product {
  name: string;
  price: number;
  stock: number;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    price: 0,
    stock: 0,
  });

  const handleAddProduct = () => {
    setProducts([...products, newProduct]);
    setNewProduct({ name: "", price: 0, stock: 0 });
  };

  const handleDeleteProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Product Management</h1>
      <p className="text-gray-600 dark:text-gray-300">Manage your products, prices, and stock</p>

      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button
          onClick={handleAddProduct}
          className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Add Product
        </button>
      </div>

      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left text-gray-600 dark:text-gray-300">Name</th>
            <th className="py-2 px-4 text-left text-gray-600 dark:text-gray-300">Price</th>
            <th className="py-2 px-4 text-left text-gray-600 dark:text-gray-300">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="border-t dark:border-gray-700">
              <td className="border px-4 py-2 text-gray-800 dark:text-white flex justify-between items-center">
                {product.name}
                <button
                  onClick={() => handleDeleteProduct(index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  Delete
                </button>
              </td>
              <td className="border px-4 py-2 text-gray-800 dark:text-white">{product.price}</td>
              <td className="border px-4 py-2 text-gray-800 dark:text-white">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
