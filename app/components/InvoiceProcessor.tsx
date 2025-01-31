"use client";

import React, { useState } from 'react';
import { correctInvoiceErrors } from '@/services/invoiceCorrectionService';

export default function InvoiceProcessor() {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [correctedInvoice, setCorrectedInvoice] = useState<any>(null);

  const handleProcessInvoice = async () => {
    try {
      const corrected = await correctInvoiceErrors(invoiceData);
      setCorrectedInvoice(corrected);
    } catch (error) {
      console.error('Error processing invoice:', error);
    }
  };

  return (
    <div>
      <h1>Invoice Processor</h1>
      <button onClick={handleProcessInvoice}>Process Invoice</button>
      {correctedInvoice && (
        <div>
          <h2>Corrected Invoice</h2>
          <pre>{JSON.stringify(correctedInvoice, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 