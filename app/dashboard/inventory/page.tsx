"use client";

import { useState } from "react";
import { langflowClient } from "@/lib/langflowClient";

export default function InventoryManagement() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await langflowClient.processInventory(query);
      setResult(response || "No response received");
    } catch (error) {
      console.error("Error:", error);
      setResult("Error processing request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about inventory..."
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {result && (
        <div className="p-4 bg-gray-800 rounded">
          <pre className="whitespace-pre-wrap text-white">{result}</pre>
        </div>
      )}
    </div>
  );
} 