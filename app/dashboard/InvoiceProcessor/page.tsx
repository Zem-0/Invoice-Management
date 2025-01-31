"use client";

import InvoiceProcessor from "../components/InvoiceProcessor";

export default function InvoiceProcessorPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">Invoice Processor</h1>
      <p className="text-zinc-400">Process and correct your invoices</p>

      {/* Add the InvoiceProcessor component here */}
      <InvoiceProcessor />
    </div>
  );
} 