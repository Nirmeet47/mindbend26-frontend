"use client";

import Link from "next/link";
import { Instagram, Linkedin, Facebook, Youtube } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative w-full pt-10">
      {/* Map Section */}
      <div className="relative w-full h-62.5 md:h-100 px-4 md:px-10 overflow-hidden mb-12">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.8534437877856!2d72.78394707520775!3d21.16713598049612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dec8b56fdf1%3A0x423b99085d26d1f9!2sSardar%20Vallabhbhai%20National%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1703012345678!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="invert rounded-2xl opacity-80"
        />
      </div>

      {/* Footer Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-zinc-950/50 py-12 md:py-20 px-6 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-12">
            {["Technical", "Managerial", "Workshops", "Sponsors"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-white/60 hover:text-cyan-400 text-sm md:text-lg font-medium uppercase tracking-[0.2em] transition-colors duration-300"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Social Media */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-12">
            {[
              { Icon: Instagram, href: "#" },
              { Icon: Linkedin, href: "#" },
              { Icon: Facebook, href: "#" },
              { Icon: Youtube, href: "#" },
            ].map(({ Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="text-white/40 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Icon size={24} strokeWidth={1.5} className="md:w-8 md:h-8" />
              </a>
            ))}
          </div>

          {/* Brand & Copyright */}
          <div className="text-center space-y-4">
            <h2
              className="text-2xl md:text-4xl font-black text-white tracking-[0.3em] uppercase"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              Mindbend
            </h2>
            <p className="text-[10px] md:text-xs text-zinc-500 tracking-[0.4em] font-mono">
              © 2026 SVNIT SURAT • ALL RIGHTS RESERVED
            </p>
          </div>

          {/* Bottom Accent Line */}
          <div className="mt-12 w-full max-w-xs h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent" />
        </div>
      </motion.div>
    </footer>
  );
}
