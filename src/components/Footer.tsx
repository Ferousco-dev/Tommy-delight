import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Send, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProxiedImageUrl } from '../utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-onyx text-white pt-32 pb-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-[10%] w-[30%] h-[30%] bg-stone-800 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] w-[30%] h-[30%] bg-stone-800 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          <div className="space-y-10">
            <div className="flex items-center gap-5 group">
              <div className="relative">
                <img 
                  src={getProxiedImageUrl("https://files.catbox.moe/rywtuf.jpg")} 
                  alt="Tommy Delights Logo" 
                  className="h-16 w-16 object-cover rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -inset-2 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-white tracking-tight leading-none">Tommy</h3>
                <h3 className="text-2xl font-serif text-stone-500 italic leading-none mt-1">Delights</h3>
              </div>
            </div>
            <p className="text-stone-400 leading-relaxed font-light text-base">
              Precision in food processing. Excellence in home & industrial services. Delivering health, convenience, and peace of mind across Nigeria.
            </p>
            <div className="flex gap-5">
              {[
                { icon: Instagram, href: "https://instagram.com/tomcredel", label: "Instagram" },
                { icon: TikTokIcon, href: "https://tiktok.com/@tommydelight0", label: "TikTok" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(212,175,55,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center transition-all border border-white/5"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 mb-10">The Collection</h4>
            <ul className="space-y-5">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'Services', href: '/services' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' }
              ].map((item, i) => (
                <li key={i}>
                  <Link to={item.href} className="text-stone-400 hover:text-white transition-all flex items-center gap-3 group font-light">
                    <div className="w-0 h-[1px] bg-gold group-hover:w-4 transition-all duration-300" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 mb-10">Our Expertise</h4>
            <ul className="space-y-5">
              {['Laundry Care', 'Industrial Cleaning', 'House Painting', 'Interior Decoration', 'Food Processing'].map((item, i) => (
                <li key={i}>
                  <a href={item === 'Food Processing' ? '#products' : '#services'} className="text-stone-400 hover:text-white transition-all flex items-center gap-3 group font-light">
                    <div className="w-0 h-[1px] bg-gold group-hover:w-4 transition-all duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 mb-10">The Insider</h4>
            <p className="text-stone-400 mb-8 font-light">Join our exclusive circle for updates on gourmet products and professional services.</p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/50 transition-all text-sm font-light group-hover:bg-white/10"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-onyx py-4 rounded-2xl font-bold hover:bg-stone-100 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
              >
                <Send size={16} />
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© {currentYear} Tommy Delights Integrated Services. All rights reserved.</p>
          <div className="flex gap-10">
            <Link to="/delivery" className="hover:text-white transition-colors">Delivery Info</Link>
            <Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TikTokIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}
