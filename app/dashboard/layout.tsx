"use client"

import { useState } from "react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { 
  IconLayoutDashboard,
  IconShoppingCart,
  IconCalendar,
  IconUser,
  IconForms,
  IconTable,
  IconSettings,
  IconChartBar,
  IconComponents,
  IconMenu2,
  IconX,
  IconSearch,
  IconBell,
  IconFileInvoice,
} from "@tabler/icons-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Sidebar from "../components/Sidebar"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Invoice Management",
    href: "/dashboard/invoices",
    icon: IconShoppingCart, 
  },
  {
    title: "Invoice Processor",
    href: "/dashboard/InvoiceProcessor",
    icon: IconCalendar,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: IconUser,
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: IconForms,
  },
  {
    title: "Tax Handling",
    href: "/dashboard/taxHandling",
    icon: IconTable,
  },

  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: IconUser,
  },
  {
    title: "Invoice Generator",
    href: "/dashboard/invoice-generator",
    icon: IconFileInvoice,
  },
]

const otherItems = [
  {
    title: "Chart",
    href: "/dashboard/chart",
    icon: IconChartBar,
  },
  {
    title: "UI Elements",
    href: "/dashboard/ui-elements",
    icon: IconComponents,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-72 p-6">
        {children}
      </main>
    </div>
  )
}