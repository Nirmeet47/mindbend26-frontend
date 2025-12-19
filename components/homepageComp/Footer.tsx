"use client";

import Link from "next/link";
import { Instagram, Linkedin, Facebook, Youtube } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative w-full bg-black">
      {/* Map Section */}
      <div className="relative w-full h-[400px] md:h-[400px] overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.8534437877856!2d72.78394707520775!3d21.16713598049612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dec8b56fdf1%3A0x423b99085d26d1f9!2sSardar%20Vallabhbhai%20National%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1703012345678!5m2!1sen!2sin"
          width="90%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale border rounded-xl mx-auto "
        />
        {/* Gradient overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" /> */}
      </div>

      {/* Footer Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-b from-black via-gray-950 to-black py-12 md:py-16"
      >
        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-12 px-4">
          <Link
            href="/about"
            className="text-white text-lg md:text-xl font-bold uppercase tracking-wider hover:text-cyan-400 transition-colors duration-300"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            About
          </Link>
          <Link
            href="/sponsors"
            className="text-white text-lg md:text-xl font-bold uppercase tracking-wider hover:text-cyan-400 transition-colors duration-300"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Sponsors
          </Link>
          <Link
            href="/contact"
            className="text-white text-lg md:text-xl font-bold uppercase tracking-wider hover:text-cyan-400 transition-colors duration-300"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Contact
          </Link>
          <Link
            href="/team"
            className="text-white text-lg md:text-xl font-bold uppercase tracking-wider hover:text-cyan-400 transition-colors duration-300"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Team
          </Link>
          <Link
            href="/events"
            className="text-white text-lg md:text-xl font-bold uppercase tracking-wider hover:text-cyan-400 transition-colors duration-300"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Events
          </Link>
        </nav>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mb-12">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram size={32} strokeWidth={1.5} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110"
            aria-label="LinkedIn"
          >
            <Linkedin size={32} strokeWidth={1.5} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110"
            aria-label="Facebook"
          >
            <Facebook size={32} strokeWidth={1.5} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110"
            aria-label="YouTube"
          >
            <Youtube size={32} strokeWidth={1.5} />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p
            className="text-white text-xl md:text-2xl font-bold uppercase tracking-[0.3em]"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            © 2026 MINDBEND
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-500/50 to-transparent" />
        </div>
      </motion.div>
    </footer>
  );
}
