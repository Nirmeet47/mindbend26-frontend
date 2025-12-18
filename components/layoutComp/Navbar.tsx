"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-mindbend-black/90 backdrop-blur-md border-b border-mindbend-neon/20" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white tracking-wider">
              MINDBEND <span className="text-mindbend-neon">.SVNIT</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['About', 'Theme', 'Events', 'Sponsors', 'Team', 'Contact'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-mindbend-neon px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-mindbend-neon">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-mindbend-black/95 backdrop-blur-xl border-b border-mindbend-neon/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {['About', 'Theme', 'Events', 'Sponsors', 'Team', 'Contact'].map((item) => (
                <Link 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-mindbend-neon block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item}
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}