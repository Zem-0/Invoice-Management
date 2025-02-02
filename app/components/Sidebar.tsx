"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconDashboard, IconFileInvoice, IconPackage, IconReceipt, IconBox, IconUser } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import Image from 'next/image'

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Invoice Management",
    href: "/dashboard/invoice-management",
    icon: IconFileInvoice,
  },
  {
    title: "Invoice Processor",
    href: "/dashboard/invoice-processor",
    icon: IconReceipt,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: IconPackage,
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: IconBox,
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

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-[#1B222C] border-r border-[#2F3746]">
      <div className="flex h-16 items-center gap-2 px-4 border-b border-[#2F3746]">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center">
            <Image
              src="/invoice.png"
              alt="Ledgerly Logo"
              width={32}
              height={32}
              className="rounded-full bg-gray-800"
            />
          </div>
          <span className="text-xl font-bold text-white">Ledgerly</span>
        </Link>
      </div>

      <div className="p-4 space-y-8">
        <nav className="space-y-1">
          {sidebarLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#2F3746]"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
} 