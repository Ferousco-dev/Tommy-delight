import React from 'react';
import { motion } from 'framer-motion';
import { getProxiedImageUrl } from '../utils';
import { useApp } from '../context/AppContext';
import { Quote, Target, Award, Heart } from 'lucide-react';

export default function About() {
  const { founder } = useApp();

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-stone-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-stone-50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Founder Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative z-10 aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border-[16px] border-stone-50 group">
              <img
                src={getProxiedImageUrl(founder.image)}
                alt={founder.name}
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              {/* Floating Name Badge */}
              <div className="absolute bottom-8 left-8 right-8 p-6 glass-panel border-white/20 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                <p className="text-white font-serif italic text-xl">{founder.name}</p>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Visionary Founder</p>
              </div>
            </div>
            
            <motion.div 
              initial={{ scale: 0, opacity: 0, rotate: -10 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="absolute -bottom-12 -right-12 bg-onyx p-12 rounded-[3rem] shadow-2xl hidden lg:block border border-white/10 z-20"
            >
              <p className="text-white font-serif text-7xl mb-1 leading-none">10+</p>
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em] whitespace-nowrap">Years of Excellence</p>
            </motion.div>

            {/* Decorative Rings */}
            <div className="absolute -top-20 -left-20 w-64 h-64 border border-stone-100 rounded-full -z-10 animate-float-expert" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 border border-stone-100 rounded-full -z-10 animate-float-expert" style={{ animationDelay: '-2s' }} />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-onyx/5 border border-onyx/10 mb-10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-onyx">The Tommy Delights Legacy</span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif text-onyx mb-10 leading-[1.1] tracking-tight">
              A Vision of <span className="italic text-stone-400">Excellence</span>
            </h2>
            
            <div className="space-y-10 text-stone-600">
              <div className="relative">
                <Quote className="absolute -top-6 -left-6 text-stone-100 w-20 h-20 -z-10 opacity-50" />
                <p className="text-2xl font-serif italic text-onyx leading-relaxed pl-6 border-l-2 border-gold mb-12">
                  "{founder.vision}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 transition-all duration-500 hover:shadow-xl hover:shadow-stone-200/50 group"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-onyx mb-6 shadow-sm border border-stone-100 group-hover:bg-onyx group-hover:text-white transition-all duration-500">
                    <Award size={24} />
                  </div>
                  <h4 className="font-bold text-onyx mb-3 text-lg">Hygienic Standards</h4>
                  <p className="text-sm leading-relaxed text-stone-500 font-light">Every product is processed under strict hygienic conditions to ensure 100% natural goodness and safety.</p>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 transition-all duration-500 hover:shadow-xl hover:shadow-stone-200/50 group"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-onyx mb-6 shadow-sm border border-stone-100 group-hover:bg-onyx group-hover:text-white transition-all duration-500">
                    <Target size={24} />
                  </div>
                  <h4 className="font-bold text-onyx mb-3 text-lg">Professional Integrity</h4>
                  <p className="text-sm leading-relaxed text-stone-500 font-light">From laundry to industrial cleaning, we deliver excellence through skilled craftsmanship and reliability.</p>
                </motion.div>
              </div>

              <div className="pt-12 space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-14 h-14 bg-onyx text-white rounded-full flex items-center justify-center shadow-2xl shadow-onyx/20">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-onyx mb-2 text-lg">Our Philosophy</h4>
                    <p className="text-base leading-relaxed text-stone-500 font-light">We believe that healthy living starts with quality nutrition and a well-maintained environment. We are committed to providing both.</p>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-stone-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-[1px] bg-gold" />
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">{founder.name}, Founder</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
