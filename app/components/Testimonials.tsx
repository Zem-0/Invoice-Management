"use client"

import { cn } from "@/lib/utils"
import { useMotionValue, motion, useMotionTemplate } from "framer-motion"
import { IconQuote } from "@tabler/icons-react"

const TestimonialHighlight = ({
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
        "relative min-h-screen bg-black flex items-center justify-center w-full group",
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

export default function Testimonials() {
  return (
    <TestimonialHighlight>
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            Trusted by leading companies worldwide
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 rounded-3xl border border-white/10 backdrop-blur-sm relative group hover:border-indigo-500/50 transition-colors"
            >
              <IconQuote className="absolute top-6 right-6 w-8 h-8 text-indigo-500/30 group-hover:text-indigo-500/50 transition-colors" />
              <div className="mb-8">
                <p className="text-zinc-300 leading-relaxed italic">"{testimonial.content}"</p>
              </div>
              <div className="mt-auto">
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-zinc-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </TestimonialHighlight>
  )
}

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CFO at TechCorp",
    content: "The AI-powered error correction has saved us countless hours of manual review. Our invoice processing accuracy has improved by 98% since implementing this solution."
  },
  {
    name: "Michael Rodriguez",
    role: "Finance Director",
    content: "The multilingual capabilities are a game-changer. We handle invoices from 12 different countries, and the automatic translation and currency conversion are flawless."
  },
  {
    name: "Emma Thompson",
    role: "Accounts Manager",
    content: "The fraud detection system caught several duplicate payments in the first month alone, saving us thousands. The ROI on this platform has been exceptional."
  },
  {
    name: "David Kim",
    role: "Operations Head",
    content: "The WhatsApp integration for invoice queries has reduced our support tickets by 70%. Vendors love the instant status updates."
  },
  {
    name: "Lisa Patel",
    role: "Finance Controller",
    content: "The analytics dashboard provides insights we never had before. We've optimized our payment cycles and improved cash flow management significantly."
  },
  {
    name: "James Wilson",
    role: "CEO",
    content: "This platform has transformed our invoice processing workflow. The AI capabilities and automation features have exceeded our expectations."
  }
]

