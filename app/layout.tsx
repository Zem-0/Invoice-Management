import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react" // Added import for React
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StreamLine - Simplify Your Workflow",
  description:
    "StreamLine is an all-in-one project management solution that helps teams boost productivity and simplify collaboration.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

