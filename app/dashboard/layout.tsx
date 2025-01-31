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
} from "@tabler/icons-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "eCommerce",
    href: "/dashboard/ecommerce",
    icon: IconShoppingCart,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: IconCalendar,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: IconUser,
  },
  {
    title: "Forms",
    href: "/dashboard/forms",
    icon: IconForms,
  },
  {
    title: "Tables",
    href: "/dashboard/tables",
    icon: IconTable,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: IconSettings,
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
    <div className="min-h-screen bg-[#1D2939]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1B222C] border-r border-[#2F3746] transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-4 border-b border-[#2F3746]">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center">
              <span className="text-lg font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold text-white">TailAdmin</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-8">
          <div>
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase">MENU</h2>
            <nav className="mt-4 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#2F3746] rounded-lg transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase">OTHERS</h2>
            <nav className="mt-4 space-y-1">
              {otherItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#2F3746] rounded-lg transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-72">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 md:left-72 h-16 border-b border-[#2F3746] bg-[#1B222C] z-40">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <IconMenu2 className="h-6 w-6" />
              </button>
              <div className="relative hidden md:block">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-72 pl-10 pr-4 py-2 text-sm text-gray-400 bg-[#2F3746] rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2F3746] relative">
                <IconBell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  }
                }}
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
} 