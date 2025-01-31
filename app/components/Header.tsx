"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="container mx-auto px-4 py-3">
        <div 
          className={`relative rounded-full border backdrop-blur-xl transition-all duration-300 max-w-2xl mx-auto
            ${scrolled 
              ? "bg-black/95 border-indigo-500/30 shadow-[0_8px_32px_-4px_rgba(79,70,229,0.1)] backdrop-brightness-[0.3]" 
              : "bg-black/70 border-white/[0.15] shadow-lg backdrop-brightness-[0.5]"
            }`}
        >
          {/* Glass reflection effect */}
          <div 
            className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"
          />
          
          {/* Bottom glow */}
          <div 
            className="absolute -bottom-[2px] -left-[1px] -right-[1px] h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
          />

          {/* Shine animation */}
          <div 
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              backgroundImage: 'linear-gradient(115deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.12) 50%, transparent 60%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shine 4s infinite linear'
            }}
          />
          
          <div className="relative flex items-center justify-between px-5 py-3">
            <Link 
              href="/" 
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 hover:from-white hover:to-indigo-300 transition-all duration-300"
            >
              StreamLine
            </Link>
            
            <nav className="hidden md:flex items-center space-x-2">
              {[
                ["Features", "#features"],
                ["Testimonials", "#testimonials"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="relative px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white group"
                >
                  {label}
                  <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm"
                    onClick={() => router.push('/dashboard')}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-full transition-all duration-300"
                  >
                    Dashboard
                  </Button>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-zinc-300 hover:text-white hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-full transition-all duration-300 shadow-[0_0_16px_-3px] shadow-indigo-600/50 border border-indigo-500/20"
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </nav>

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-zinc-400 hover:text-white hover:bg-white/10 relative group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
