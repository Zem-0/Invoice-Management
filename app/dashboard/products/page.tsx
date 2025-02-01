"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: "",
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      console.log("Fetched products:", data);
      setProducts(data || []);
    }
  };

  const handleAddProduct = async () => {
    console.log("Adding product:", newProduct);
    const { data, error } = await supabase.from('products').insert([newProduct]);
    if (error) {
      console.error("Error adding product:", error);
    } else {
      console.log("Product added:", data);
      setNewProduct({ name: "", price: 0, stock: 0 });
      // Fetch products again to update the list
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    console.log("Deleting product with id:", id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error("Error deleting product:", error);
    } else {
      setProducts(products.filter((product) => product.id !== id));
    }
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
            <th className="py-2 px-4 text-left text-gray-600 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t dark:border-gray-700">
              <td className="border px-4 py-2 text-gray-800 dark:text-white">{product.name}</td>
              <td className="border px-4 py-2 text-gray-800 dark:text-white">{product.price}</td>
              <td className="border px-4 py-2 text-gray-800 dark:text-white">{product.stock}</td>
              <td className="border px-4 py-2 text-gray-800 dark:text-white">
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
