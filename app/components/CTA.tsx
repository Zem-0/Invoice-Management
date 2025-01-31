"use client"

import { SectionBackground } from "@/components/ui/section-background"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { Button } from "@/components/ui/button"

const words = [
  {
    text: "Ready",
    className: "text-white",
  },
  {
    text: "to",
    className: "text-white",
  },
  {
    text: "transform",
    className: "text-indigo-500 dark:text-indigo-500",
  },
  {
    text: "your",
    className: "text-white",
  },
  {
    text: "workflow?",
    className: "text-white",
  },
]

export default function CTA() {
  return (
    <SectionBackground className="py-24" variant="card">
      <div className="container mx-auto px-4 text-center">
        <TypewriterEffect words={words} />
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
          Join thousands of teams already using StreamLine to improve their productivity and collaboration.
        </p>
        <div className="mt-10">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-full transition-all duration-300 shadow-[0_0_16px_-3px] shadow-indigo-600/50 border border-indigo-500/20"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </SectionBackground>
  )
}

