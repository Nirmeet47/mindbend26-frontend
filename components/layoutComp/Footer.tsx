import { Instagram, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-mindbend-darkBlue border-t border-mindbend-neon/20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">MINDBEND <span className="text-mindbend-neon">2025</span></h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Forging the Future of Indian Intelligence. The Cognitive Genesis begins here at SVNIT.
        </p>
        
        <div className="flex justify-center space-x-6 mb-8">
          {[Instagram, Linkedin, Twitter, Mail].map((Icon, i) => (
            <a key={i} href="#" className="text-gray-400 hover:text-mindbend-neon transition-colors transform hover:scale-110">
              <Icon size={24} />
            </a>
          ))}
        </div>
        
        <div className="text-gray-500 text-sm">
          <p>© 2025 Mindbend SVNIT. All rights reserved.</p>
          <p className="mt-2">Made with ⚡ by the Web Team</p>
        </div>
      </div>
    </footer>
  );
}