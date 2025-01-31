"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconDashboard, IconFileInvoice, IconLogout } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Invoice Management",
    href: "/dashboard/invoices",
    icon: IconFileInvoice,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 h-screen w-64 bg-black/50 backdrop-blur-sm border-r border-white/[0.08] p-6">
      <div className="flex flex-col h-full">
        <div className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-indigo-500/10 text-indigo-500"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.title}
            </Link>
          ))}
        </div>
        
        <div className="mt-auto">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.08] w-full">
            <IconLogout className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
} 