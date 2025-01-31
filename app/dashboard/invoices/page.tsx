"use client";

import InvoiceProcessor from "../components/InvoiceProcessor";

export default function InvoiceManagement() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">Invoice Management</h1>
      <p className="text-zinc-400">Manage and track your invoices</p>

      {/* Add the InvoiceProcessor component here */}
      <InvoiceProcessor />
    </div>
  );
} 