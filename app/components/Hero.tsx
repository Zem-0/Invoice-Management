"use client"

import { motion } from "framer-motion"
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <HeroHighlight>
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, -5, 0] }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          className="text-2xl md:text-4xl lg:text-6xl font-bold text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          Transform Your Workflow with{" "}
          <Highlight className="text-white">
            Streamlined Solutions
          </Highlight>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl mt-8 max-w-2xl mx-auto text-neutral-400 text-center"
        >
          Boost productivity and simplify collaboration with our all-in-one project management solution.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-4 justify-center mt-12"
        >
          <Button 
            size="lg" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-full"
          >
            Start Your Free Trial
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-indigo-600/20 hover:bg-indigo-600/10 text-white rounded-full"
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </HeroHighlight>
  )
}

