import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getProxiedImageUrl, getWhatsAppLink, WHATSAPP_NUMBER_1 } from '../utils';
import { useApp } from '../context/AppContext';

export default function Hero() {
  const { homepage } = useApp();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  const handleOrderNow = () => {
    const message = "Hello Tommy Delights, I would like to place an order.";
    window.open(getWhatsAppLink(WHATSAPP_NUMBER_1, message), '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with Layered Effects */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src="https://files.catbox.moe/6g32kg.jpg"
          alt="Tommy Delights Background"
          className="w-full h-full object-cover scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/95 via-ivory/60 to-ivory" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 mb-8 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-onyx">Quality You Can Trust</span>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-8 leading-tight tracking-tight text-onyx">
              {homepage.heroHeadline}
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-xl font-sans text-stone-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              {homepage.heroSubtext}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                <ShoppingBag size={18} />
                View Products
                <ArrowRight size={18} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-outline"
                onClick={handleOrderNow}
              >
                <MessageCircle size={18} />
                Order on WhatsApp
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
                <img
                  src={getProxiedImageUrl("https://files.catbox.moe/rywtuf.jpg")}
                  alt="Tommy Delights Logo"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
