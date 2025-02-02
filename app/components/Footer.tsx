"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  IconBrandGithub, 
  IconBrandTwitter, 
  IconBrandLinkedin, 
  IconBrandDiscord,
  IconMail
} from "@tabler/icons-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Ledgerly
            </h3>
            <p className="text-zinc-400 text-sm">
              Revolutionizing invoice processing with AI-powered automation and intelligent workflows.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-indigo-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 hover:text-indigo-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 hover:text-indigo-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-zinc-400 text-sm mb-4">
              Subscribe to our newsletter for updates and insights.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-sm"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-zinc-400 text-sm">
              © {new Date().getFullYear()} StreamLine. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-zinc-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

const socialLinks = [
  {
    name: 'GitHub',
    href: '#',
    icon: IconBrandGithub
  },
  {
    name: 'Twitter',
    href: '#',
    icon: IconBrandTwitter
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: IconBrandLinkedin
  },
  {
    name: 'Discord',
    href: '#',
    icon: IconBrandDiscord
  },
  {
    name: 'Email',
    href: 'mailto:contact@streamline.com',
    icon: IconMail
  }
]

const productLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Integrations', href: '#integrations' },
  { name: 'Documentation', href: '#docs' },
  { name: 'API Reference', href: '#api' }
]

const companyLinks = [
  { name: 'About Us', href: '#about' },
  { name: 'Careers', href: '#careers' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' }
]

const legalLinks = [
  { name: 'Privacy Policy', href: '#privacy' },
  { name: 'Terms of Service', href: '#terms' },
  { name: 'Cookie Policy', href: '#cookies' }
]

