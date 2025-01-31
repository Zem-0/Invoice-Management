"use client"

import { SectionBackground } from "@/components/ui/section-background"
import { motion } from "framer-motion"
import Image from "next/image"
import { featureImages } from "@/lib/feature-images"

export default function Features() {
  return (
    <SectionBackground className="py-32" variant="card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
          >
            Key Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            Everything you need to streamline your workflow and boost productivity
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-black/50 backdrop-blur-sm border border-white/[0.08] hover:border-indigo-500/50 transition-colors"
            >
              <Image
                src={card.src}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 md:p-12 flex flex-col justify-end backdrop-blur-[2px] group-hover:via-black/60 transition-colors">
                <div className="relative z-10">
                  <p className="text-sm md:text-base text-indigo-300 font-medium mb-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {card.category}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {card.title}
                  </h3>
                  <p className="text-zinc-400 text-sm md:text-base max-w-lg opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionBackground>
  )
}

const featureCards = [
  {
    src: featureImages.taskManagement,
    title: "Task Management",
    category: "Productivity",
    description: "Organize and prioritize tasks with our intuitive interface. Drag-and-drop organization, custom categories, and real-time progress tracking.",
  },
  {
    src: featureImages.collaboration,
    title: "Real-time Collaboration",
    category: "Team Work",
    description: "Work together seamlessly with your team. Real-time document editing, team chat, and integrated video calls all in one place.",
  },
  {
    src: featureImages.analytics,
    title: "Team Analytics",
    category: "Insights",
    description: "Gain valuable insights into your team's performance with detailed metrics, trends analysis, and customizable dashboards.",
  },
  {
    src: featureImages.security,
    title: "Advanced Security",
    category: "Protection",
    description: "Enterprise-grade security with end-to-end encryption, two-factor authentication, and role-based access control.",
  },
]

