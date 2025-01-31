"use client"

import { cn } from "@/lib/utils"

interface SectionBackgroundProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "glow" | "card"
}

export function SectionBackground({ 
  children, 
  className,
  variant = "default" 
}: SectionBackgroundProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Base background */}
      <div className="absolute inset-0 bg-black/90" />
      
      {/* Dot pattern */}
      <div className="absolute inset-0 bg-dot-thick-neutral-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {variant === "glow" && (
        <>
          {/* Animated gradient orbs */}
          <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-8 right-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-24 left-24 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </>
      )}
      
      {variant === "card" && (
        <>
          {/* Card-style gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-neutral-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
        </>
      )}
      
      {variant === "default" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/50" />
      )}
      
      {/* Content */}
      <div className="relative">{children}</div>
    </section>
  )
} 