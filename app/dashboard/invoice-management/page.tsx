"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { IconDownload, IconTrash, IconUpload } from "@tabler/icons-react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

interface Invoice {
  id: string
  name: string
  total: number
  Timestamp: string
  status: string
  file_url: string
}

export default function InvoiceManagement() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploadName, setUploadName] = useState("")

  useEffect(() => {
    // Check if user auth is loaded and user is signed in
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/sign-in') // Redirect to sign in if not authenticated
        return
      }
      fetchInvoices() // Fetch invoices only if user is authenticated
    }
  }, [isLoaded, isSignedIn, user?.id])

  const fetchInvoices = async () => {
    if (!user?.id) return // Don't fetch if no user ID

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id,
          name,
          total,
          Timestamp,
          status,
          file_url
        `)
        .eq('user_id', user.id)
        .order('Timestamp', { ascending: false })

      if (error) {
        console.error('Supabase error:', error.message)
        throw new Error(error.message)
      }

      console.log('Fetched invoices:', data)
      setInvoices(data || [])
      
    } catch (error) {
      console.error('Full error:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="p-6 text-center text-gray-400">
        Loading...
      </div>
    )
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !uploadName) {
      alert("Please provide a name and select a file.")
      return
    }

    try {
      // Upload file to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('invoices')
        .upload(`${user?.id}/${file.name}`, file)

      if (storageError) throw storageError

      // Get public URL
      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/invoices/${user?.id}/${file.name}`

      // Insert invoice record
      const { error: dbError } = await supabase
        .from('invoices')
        .insert([{
          name: uploadName,
          file_url: fileUrl,
          status: 'pending',
          user_id: user?.id,
          Timestamp: new Date().toISOString(),
          total: 0
        }])

      if (dbError) throw dbError

      // Reset form and refresh list
      setFile(null)
      setUploadName("")
      fetchInvoices()
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload invoice')
    }
  }

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName // Use the original file name
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download file')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Invoice Management</h1>
        <p className="text-gray-400">View and manage all invoices</p>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <input
          type="text"
          placeholder="Invoice Name"
          value={uploadName}
          onChange={(e) => setUploadName(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 text-white"
        />
        <div className="flex gap-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="flex-1 p-2 bg-gray-700 rounded-md border border-gray-600 text-white"
            accept=".pdf,.doc,.docx"
          />
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <IconUpload className="w-5 h-5" />
            Upload
          </button>
        </div>
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
                          onClick={() => handleDownload(
                            invoice.file_url,
                            invoice.name + '_' + invoice.id.slice(0, 6) + '.pdf'
                          )}
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