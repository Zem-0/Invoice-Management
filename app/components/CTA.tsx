"use client"

import { cn } from "@/lib/utils"
import { useMotionValue, motion, useMotionTemplate } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const CTAHighlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "relative min-h-[50vh] bg-black flex items-center justify-center w-full group",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-dot-thick-neutral-800 pointer-events-none" />
      <motion.div
        className="pointer-events-none bg-dot-thick-indigo-500 absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />
      <div className="relative z-20 w-full">{children}</div>
    </div>
  );
};

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
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const handleClick = () => {
    if (isSignedIn) {
      router.push('/dashboard')
    } else {
      router.push('/sign-in?redirect_url=/dashboard')
    }
  }

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <CTAHighlight>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TypewriterEffect words={words} />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto"
          >
            Join thousands of teams already using StreamLine to improve their productivity and collaboration.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10"
          >
            <Button 
              onClick={scrollToHero}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-full px-8 py-6 text-lg transition-all duration-300 shadow-[0_0_16px_-3px] shadow-indigo-600/50 border border-indigo-500/20 hover:shadow-[0_0_24px_-3px] hover:shadow-indigo-600/60"
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </div>
    </CTAHighlight>
  )
}

