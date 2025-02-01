"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Invoice {
  id: string;
  name: string;
  file_url: string;
  status: string;
  created_at: string;
}

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [invoiceName, setInvoiceName] = useState<string>("");
  const [status, setStatus] = useState<string>("Pending");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const { data, error } = await supabase.from('invoices').select('*');
    if (error) {
      console.error("Error fetching invoices:", error);
    } else {
      console.log("Fetched invoices:", data);
      setInvoices(data || []);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !invoiceName) {
      alert("Please provide a name and select a file.");
      return;
    }

    const { data: storageData, error: storageError } = await supabase.storage
      .from('invoices') // Ensure this matches the bucket name you created
      .upload(`invoices/${file.name}`, file);

    if (storageError) {
      console.error("Error uploading file:", storageError);
      return;
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/invoices/${file.name}`;

    const { data, error } = await supabase.from('invoices').insert([{ name: invoiceName, file_url: fileUrl, status }]);
    if (error) {
      console.error("Error inserting invoice:", error);
    } else {
      setInvoiceName("");
      setFile(null);
      // Fetch invoices again to update the list
      fetchInvoices();
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('invoices').update({ status: newStatus }).eq('id', id);
    if (error) {
      console.error("Error updating invoice status:", error);
    } else {
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === id ? { ...invoice, status: newStatus } : invoice
        )
      );
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold">Invoice Management</h1>
      <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Invoice Name"
          value={invoiceName}
          onChange={(e) => setInvoiceName(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
        >
          <option value="Pending">Pending</option>
          <option value="Done">Done</option>
        </select>
        <input type="file" onChange={handleFileChange} className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white" />
        <button onClick={handleUpload} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Upload Invoice
        </button>
      </div>

      <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
        <thead className="bg-gray-700">
          <tr>
            <th className="py-3 px-4 text-left text-gray-300">Name</th>
            <th className="py-3 px-4 text-left text-gray-300">Timestamp</th>
            <th className="py-3 px-4 text-left text-gray-300">File</th>
            <th className="py-3 px-4 text-left text-gray-300">Status</th>
            <th className="py-3 px-4 text-left text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-t border-gray-600 hover:bg-gray-700 transition">
              <td className="border px-4 py-2">{invoice.name}</td>
              <td className="border px-4 py-2">{new Date(invoice.created_at).toLocaleString()}</td>
              <td className="border px-4 py-2">
                <a href={invoice.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  {invoice.file_url.split('/').pop()}
                </a>
              </td>
              <td className="border px-4 py-2">{invoice.status}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleStatusChange(invoice.id, invoice.status === "Pending" ? "Done" : "Pending")}
                  className="text-blue-400 hover:text-blue-600"
                >
                  Mark as {invoice.status === "Pending" ? "Done" : "Pending"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}