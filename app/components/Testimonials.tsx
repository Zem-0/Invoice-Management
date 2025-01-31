"use client"

import { SectionBackground } from "@/components/ui/section-background"
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"
import { testimonialImages } from "@/lib/testimonial-images"

const testimonials = [
  {
    quote: "StreamLine has revolutionized our team's workflow. It's a game-changer for our productivity and collaboration!",
    name: "Sarah Chen",
    designation: "CEO at Tech Innovators Inc.",
    src: testimonialImages.person1,
  },
  {
    quote: "The intuitive interface and powerful features make project management a breeze. Best decision we've made!",
    name: "Alex Rivera",
    designation: "CTO at Creative Solutions LLC",
    src: testimonialImages.person2,
  },
  {
    quote: "We've seen a 30% increase in productivity since adopting StreamLine. The results speak for themselves.",
    name: "Emma Thompson",
    designation: "Director at Global Enterprises",
    src: testimonialImages.person3,
  },
]

export default function Testimonials() {
  return (
    <SectionBackground className="py-24" variant="glow">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
          What Our Customers Say
        </h2>
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
      </div>
    </SectionBackground>
  )
}

