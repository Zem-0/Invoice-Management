"use client"

import { useTheme } from "next-themes"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" /> // Placeholder with same dimensions
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2F3746] transition-colors"
    >
      {theme === "dark" ? (
        <IconSun className="h-5 w-5" />
      ) : (
        <IconMoon className="h-5 w-5" />
      )}
    </button>
  )
} 