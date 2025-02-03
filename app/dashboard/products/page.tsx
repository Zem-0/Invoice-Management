"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  IconPackage, 
  IconPlus, 
  IconTrash, 
  IconEdit, 
  IconCurrency, 
  IconBox 
} from "@tabler/icons-react";

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
    <div className="min-h-screen bg-black p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            Product Management
          </h1>
          <p className="text-zinc-400 mt-2">Manage your products, prices, and inventory</p>
        </div>

        {/* Add Product Form */}
        <motion.div 
          className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
                  <IconPackage className="w-4 h-4 mr-2" />
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
                  <IconCurrency className="w-4 h-4 mr-2" />
                  Price
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
                  <IconBox className="w-4 h-4 mr-2" />
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50"
            >
              <IconPlus className="w-4 h-4" />
              Add Product
            </motion.button>
          </form>
        </motion.div>

        {/* Products Table */}
        <motion.div 
          className="bg-zinc-900/50 rounded-2xl border border-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-zinc-400 font-medium">Product</th>
                  <th className="text-left py-4 px-6 text-zinc-400 font-medium">Price</th>
                  <th className="text-left py-4 px-6 text-zinc-400 font-medium">Stock</th>
                  <th className="text-right py-4 px-6 text-zinc-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr 
                    key={product.uuid} 
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-6 text-white">{product.name}</td>
                    <td className="py-4 px-6 text-white">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-white">{product.stock}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-zinc-400 hover:text-white transition-colors"
                        >
                          <IconEdit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteProduct(product.uuid)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <IconTrash className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
