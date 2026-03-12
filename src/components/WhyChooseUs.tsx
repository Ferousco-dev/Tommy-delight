import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, DollarSign, Users, Zap } from 'lucide-react';

const features = [
  {
    title: 'Hygienic Processing',
    description: 'We follow strict health standards in all our food processing stages.',
    icon: ShieldCheck
  },
  {
    title: 'Affordable Pricing',
    description: 'Premium quality services and products at prices that fit your budget.',
    icon: DollarSign
  },
  {
    title: 'Professional Team',
    description: 'Our staff are highly trained and dedicated to providing the best service.',
    icon: Users
  },
  {
    title: 'Fast & Reliable',
    description: 'On-time delivery and prompt service response for all your needs.',
    icon: Zap
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-onyx text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-stone-800 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-stone-800 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">The Tommy Standard</span>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-10 leading-[1.1] tracking-tight"
            >
              Excellence in Every <br />
              <span className="text-stone-500 italic">Mastered Detail</span>
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-stone-400 text-xl mb-16 leading-relaxed max-w-xl font-light"
            >
              At Tommy Delights, we harmonize heritage with modern precision. Every gourmet product and professional service is a testament to our unwavering commitment to perfection.
            </motion.p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:bg-gold group-hover:text-onyx group-hover:border-gold group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-500">
                    <feature.icon size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 tracking-tight group-hover:text-gold transition-colors duration-500">{feature.title}</h4>
                    <p className="text-stone-500 text-sm leading-relaxed font-light">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="aspect-square rounded-[4rem] overflow-hidden shadow-[0_64px_128px_-24px_rgba(0,0,0,0.5)] border-[16px] border-white/5 group">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
                alt="Quality Service"
                className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-onyx/20 group-hover:bg-transparent transition-colors duration-1000" />
            </div>
            
            {/* Floating Achievement */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-12 -left-12 glass-panel p-12 rounded-[3rem] shadow-2xl border-white/20 z-20"
            >
              <div className="text-white font-serif font-bold text-center">
                <span className="text-6xl block mb-2 leading-none">100%</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Guaranteed Mastery</span>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 border border-white/10 rounded-full animate-pulse" />
            <div className="absolute top-20 -right-20 w-64 h-64 border border-white/5 rounded-full animate-float-expert" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
