"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Product {
  uuid: string;
  id: string;
  name: string;
  price: number;
  stock: number;
  user_id: string;
}

export default function ProductManagement() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: "",
    price: 0,
    stock: 0,
    uuid: "",
    user_id: ""
  });

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/sign-in');
        return;
      }
      fetchProducts();
    }
  }, [isLoaded, isSignedIn]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert("Please sign in to add products");
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: newProduct.name,
            price: newProduct.price,
            stock: newProduct.stock,
            user_id: user.id
          }
        ])

      if (error) throw error;

      setNewProduct({ name: "", price: 0, stock: 0, uuid: "", user_id: "" });
      fetchProducts();
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleDeleteProduct = async (uuid: string) => {
    console.log("Deleting product with uuid:", uuid);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('uuid', uuid);
    
    if (error) {
      console.error("Error deleting product:", error);
    } else {
      setProducts(products.filter((product) => product.uuid !== uuid));
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
            <tr key={product.uuid} className="border-t dark:border-gray-700">
              <td className="border px-4 py-2 text-gray-800 dark:text-white">{product.name}</td>
              <td className="border px-4 py-2 text-gray-800 dark:text-white">{product.price}</td>
              <td className="border px-4 py-2 text-gray-800 dark:text-white">{product.stock}</td>
              <td className="border px-4 py-2 text-gray-800 dark:text-white">
                <button
                  onClick={() => handleDeleteProduct(product.uuid)}
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
