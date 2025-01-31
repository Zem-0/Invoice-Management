"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRef, useState } from "react"
import { useOutsideClick } from "@/hooks/use-outside-click"
import { IconX } from "@tabler/icons-react"

interface FeatureCardProps {
  card: {
    src: string
    title: string
    category: string
    content: React.ReactNode
  }
  index: number
}

export function FeatureCard({ card, index }: FeatureCardProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useOutsideClick(containerRef, () => setOpen(false))

  return (
    <>
      <motion.div
        onClick={() => setOpen(true)}
        className="group relative w-80 h-96 rounded-3xl overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.02 }}
      >
        <Image
          src={card.src}
          alt={card.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
          <p className="text-sm text-indigo-300">{card.category}</p>
          <h3 className="text-xl font-bold text-white mt-2">{card.title}</h3>
        </div>
      </motion.div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-2xl w-full relative"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800"
            >
              <IconX className="w-4 h-4" />
            </button>
            {card.content}
          </motion.div>
        </div>
      )}
    </>
  )
} 