import axios from 'axios';

const GEMINI_API_URL = 'https://api.gemini.com/v1/invoice-correction';
const API_KEY = process.env.GEMINI_API_KEY;

export async function correctInvoiceErrors(invoiceData: any) {
  try {
    const response = await axios.post(GEMINI_API_URL, invoiceData, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error correcting invoice:', error);
    throw new Error('Failed to correct invoice errors');
  }
} 