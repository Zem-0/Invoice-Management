"use client"

import { cn } from "@/lib/utils"
import { useMotionValue, motion, useMotionTemplate } from "framer-motion"
import { IconBrain, IconRocket, IconShield, IconUsers, IconWorld, IconShieldCheck, IconCategory, IconMessageChatbot, IconChartBar } from "@tabler/icons-react"

const FeatureHighlight = ({
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

export default function Features() {
  return (
    <FeatureHighlight>
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
          >
            Why Choose Us?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            Experience the future of business management with our cutting-edge features
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row items-center gap-8 mb-20 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="flex-1">
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <feature.icon className="w-12 h-12 text-indigo-400 mb-6" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="flex items-center text-zinc-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3" />
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative h-[400px] w-full rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <feature.icon className="w-24 h-24 text-white/20" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </FeatureHighlight>
  );
}

const features = [
  {
    title: "AI-Powered Invoice Error Correction",
    description: "Many invoices contain mistakes like incorrect tax calculations, missing fields, or duplicate entries.",
    icon: IconBrain,
    benefits: [
      "Auto-corrects calculation errors in real-time",
      "Fills missing invoice details automatically",
      "Ensures compliance with tax regulations",
      "Validates data before submission"
    ]
  },
  {
    title: "Multilingual & Multi-Currency Processing",
    description: "Process invoices in any language and currency without the hassle of manual translation and conversion.",
    icon: IconWorld,
    benefits: [
      "Real-time currency conversion with live rates",
      "AI-powered OCR for multiple languages",
      "Automatic invoice translation",
      "Support for all major currencies"
    ]
  },
  {
    title: "Advanced Fraud Detection",
    description: "Protect your business from financial fraud with our AI-powered detection system.",
    icon: IconShieldCheck,
    benefits: [
      "AI-based anomaly detection",
      "Duplicate payment prevention",
      "Pattern-based fraud detection",
      "Automated risk assessment"
    ]
  },
  {
    title: "Smart Categorization & Tax Handling",
    description: "Automatically organize invoices and handle tax calculations with AI precision.",
    icon: IconCategory,
    benefits: [
      "Automatic invoice categorization",
      "Smart tax code assignment",
      "Business expense classification",
      "Vendor detail management"
    ]
  },
  {
    title: "Instant Query Resolution",
    description: "Provide instant invoice status updates through WhatsApp and Email integration.",
    icon: IconMessageChatbot,
    benefits: [
      "WhatsApp status tracking",
      "Email-based query resolution",
      "Automated response system",
      "Real-time payment updates"
    ]
  },
  {
    title: "Smart Analytics & Forecasting",
    description: "Gain valuable insights into your spending patterns and make data-driven decisions.",
    icon: IconChartBar,
    benefits: [
      "Expense pattern analysis",
      "Predictive spending forecasts",
      "Vendor payment analytics",
      "Custom report generation"
    ]
  }
]

