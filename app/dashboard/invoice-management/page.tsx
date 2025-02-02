"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { IconDownload, IconTrash } from "@tabler/icons-react"

interface Invoice {
  id: string
  name: string
  total: number
  Timestamp: string
  status: string
}

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('invoices')
        .select('id, name, total, Timestamp, status')
        .order('Timestamp', { ascending: false })

      if (error) {
        console.error('Supabase error details:', error)
        throw error
      }

      console.log('Fetched data:', data)
      setInvoices(data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error fetching invoices:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const deleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh the invoices list after deletion
      fetchInvoices()
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('Failed to delete invoice')
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'done' : 'pending'
      
      const { error } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Refresh the invoices list
      fetchInvoices()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Invoice Management</h1>
        <p className="text-gray-400">View and manage all invoices</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="text-white">{invoice.name}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {formatDate(invoice.Timestamp)}
                    </td>
                    <td className="py-3 px-4 text-white">
                      ${invoice.total ? invoice.total.toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(invoice.id, invoice.status)}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          invoice.status === 'done' 
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                        }`}
                      >
                        {invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'Pending'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-colors"
                          title="Delete Invoice"
                        >
                          <IconTrash className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                          title="Download Invoice"
                        >
                          <IconDownload className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 