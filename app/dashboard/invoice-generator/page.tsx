"use client"

import { useState, useEffect } from "react"
import { IconPlus, IconTrash, IconDownload } from "@tabler/icons-react"
import { supabase } from "@/lib/supabaseClient"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { UserOptions } from 'jspdf-autotable'
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

// Add this to make TypeScript recognize autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF
  }
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

interface InvoiceItem {
  productId: string
  description: string
  quantity: number
  price: number
  isManual?: boolean
}

export default function InvoiceGenerator() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [items, setItems] = useState<InvoiceItem[]>([
    { productId: "", description: "", quantity: 1, price: 0 }
  ])
  const [products, setProducts] = useState<Product[]>([])
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/sign-in')
        return
      }
      fetchProducts()
    }
  }, [isLoaded, isSignedIn])

  const fetchProducts = async () => {
    if (!user?.id) return

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .gt('stock', 0)
    
    if (error) {
      console.error("Error fetching products:", error)
    } else {
      console.log("Fetched products:", data)
      setProducts(data || [])
    }
  }

  const addItem = (isManual: boolean = false) => {
    setItems([...items, { 
      productId: "", 
      description: "", 
      quantity: 1, 
      price: 0,
      isManual 
    }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      const newItems = [...items]
      newItems[index] = {
        productId: product.id,
        description: product.name,
        quantity: 1,
        price: product.price
      }
      setItems(newItems)
    }
  }

  const updateQuantity = (index: number, quantity: number) => {
    const product = products.find(p => p.id === items[index].productId)
    if (product && quantity <= product.stock) {
      const newItems = [...items]
      newItems[index] = { ...newItems[index], quantity }
      setItems(newItems)
    }
  }

  const updateManualItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value
    }
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0)
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Add company logo/header
    doc.setFontSize(20)
    doc.text('Invoice', 14, 22)
    
    // Add invoice info
    doc.setFontSize(12)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35)
    doc.text(`Invoice #: INV-${Date.now().toString().slice(-6)}`, 14, 42)
    
    // Add client info
    doc.text('Bill To:', 14, 55)
    doc.setFontSize(11)
    doc.text(clientName, 14, 62)
    doc.text(clientEmail, 14, 69)
    
    // Add items table
    const tableColumn = ["Product", "Quantity", "Price", "Total"]
    const tableRows = items.map(item => [
      item.description,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.quantity * item.price).toFixed(2)}`
    ])
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] }
    })
    
    // Add total
    const finalY = (doc as any).lastAutoTable.finalY || 80
    doc.text(`Total: $${calculateTotal().toFixed(2)}`, 14, finalY + 20)
    
    // Save PDF
    doc.save(`invoice-${Date.now()}.pdf`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      alert("Please sign in to create invoices")
      return
    }

    try {
      // Create invoice in database with user_id instead of uid
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert([
          {
            name: clientName,
            total: calculateTotal(),
            Timestamp: new Date().toISOString(),
            status: 'pending',
            file_url: 'pending',
            user_id: user.id,
            client_email: clientEmail,
            client_name: clientName
          }
        ])

      if (invoiceError) {
        console.error('Detailed error:', invoiceError)
        throw invoiceError
      }

      // Reset form
      setItems([{ productId: "", description: "", quantity: 1, price: 0 }])
      setClientName("")
      setClientEmail("")

      alert('Invoice created successfully!')
      
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('Failed to create invoice. Please check the console for details.')
    }
  }

  if (!isLoaded) {
    return (
      <div className="p-6 text-center text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Invoice Generator</h1>
        <p className="text-gray-400">Create and manage your invoices</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Information */}
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium text-white mb-4">Client Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Client Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">Invoice Items</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addItem(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <IconPlus className="w-4 h-4" />
                Add Manual Item
              </button>
              <button
                type="button"
                onClick={() => addItem(false)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <IconPlus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium w-32">Quantity</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium w-32">Price</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium w-32">Subtotal</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    <td className="py-3 px-4">
                      {item.isManual ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateManualItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-1.5"
                          required
                        />
                      ) : (
                        <select
                          value={item.productId}
                          onChange={(e) => updateItem(index, e.target.value)}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-1.5"
                          required
                        >
                          <option value="">Select a product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (Stock: {product.stock})
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => item.isManual 
                          ? updateManualItem(index, 'quantity', parseInt(e.target.value))
                          : updateQuantity(index, parseInt(e.target.value))
                        }
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-1.5"
                        min="1"
                        max={item.isManual ? undefined : products.find(p => p.id === item.productId)?.stock || 1}
                        required
                      />
                    </td>
                    <td className="py-3 px-4">
                      {item.isManual ? (
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateManualItem(index, 'price', parseFloat(e.target.value))}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-1.5"
                          min="0"
                          step="0.01"
                          required
                        />
                      ) : (
                        <input
                          type="text"
                          value={`$${item.price.toFixed(2)}`}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-1.5"
                          disabled
                        />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={`$${(item.quantity * item.price).toFixed(2)}`}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-1.5"
                        disabled
                      />
                    </td>
                    <td className="py-3 px-4">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-colors"
                        >
                          <IconTrash className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-700">
                  <td colSpan={3} className="py-4 px-4 text-right text-white font-medium">
                    Total:
                  </td>
                  <td className="py-4 px-4 text-white font-bold">
                    ${calculateTotal().toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Submit and Download Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={generatePDF}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 font-medium flex items-center gap-2"
          >
            <IconDownload className="w-5 h-5" />
            Download PDF
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 font-medium"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </div>
  )
} 