import Header from "./components/Header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import Testimonials from "./components/Testimonials"
import CTA from "./components/CTA"
import Footer from "./components/Footer"
import InvoiceProcessor from "./components/InvoiceProcessor"
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

