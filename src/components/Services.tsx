import React from 'react';
import { motion } from 'framer-motion';
import { WashingMachine, Sparkles, Paintbrush, Home, MessageCircle, Utensils, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn, getWhatsAppLink, WHATSAPP_NUMBER_1 } from '../utils';

export default function Services() {
  const { services } = useApp();

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('laundry')) return WashingMachine;
    if (n.includes('cleaning')) return Sparkles;
    if (n.includes('painting')) return Paintbrush;
    if (n.includes('decoration')) return Home;
    if (n.includes('food')) return Utensils;
    return Sparkles;
  };

  const categories = ['Food Processing', 'Professional Services'];

  return (
    <section id="services" className="py-32 relative overflow-hidden bg-stone-50">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-stone-100 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-stone-100 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-onyx/5 border border-onyx/10 mb-10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-onyx">Professional Mastery</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 1 }}
            className="text-3xl sm:text-5xl md:text-8xl font-serif font-bold text-onyx mb-10 leading-[0.85] tracking-tighter"
          >
            Bespoke <span className="text-stone-400 italic">Services</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed"
          >
            From artisanal food processing to expert home maintenance, we provide meticulously crafted solutions tailored for your lifestyle.
          </motion.p>
        </div>

        <div className="space-y-40">
          {categories.map((category, catIndex) => (
            <div key={category} className="space-y-20">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-10"
              >
                <h3 className="text-4xl font-serif font-bold text-onyx tracking-tight">{category}</h3>
                <div className="h-px flex-1 bg-onyx/10" />
                <div className="w-3 h-3 rounded-full border border-onyx/20" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {services
                  .filter(s => s.category === category)
                  .map((service, index) => {
                    const Icon = getIcon(service.name);
                    const isLaundry = service.name.toLowerCase().includes('laundry');

                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="glass-panel p-12 rounded-[3.5rem] group flex flex-col h-full border-white/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-2"
                      >
                        <div className="w-24 h-24 rounded-[2rem] bg-onyx text-white flex items-center justify-center mb-10 shadow-2xl group-hover:bg-gold group-hover:text-onyx transition-all duration-500 group-hover:rotate-6 overflow-hidden">
                          {service.image ? (
                            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                          ) : (
                            <Icon size={40} />
                          )}
                        </div>
                        
                        <div className="flex justify-between items-start mb-6">
                          <h4 className="text-3xl font-serif font-bold text-onyx leading-tight group-hover:text-stone-400 transition-colors duration-500">{service.name}</h4>
                          {service.price && (
                            <span className="text-xl font-serif text-onyx">₦{service.price}</span>
                          )}
                        </div>
                        <p className="text-stone-500 mb-10 leading-relaxed flex-1 text-base font-light">
                          {service.description}
                        </p>

                        {isLaundry && (
                          <div className="mb-10 aspect-video rounded-[2.5rem] overflow-hidden relative group/video cursor-pointer shadow-xl border-8 border-white/50 bg-stone-200">
                            {service.videoUrl ? (
                              <video 
                                src={service.videoUrl} 
                                className="w-full h-full object-cover"
                                controls
                                poster="https://files.catbox.moe/6g32kg.jpg"
                              />
                            ) : (
                              <>
                                <img 
                                  src="https://files.catbox.moe/6g32kg.jpg" 
                                  alt="Service Showcase" 
                                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover/video:scale-110 opacity-60"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-onyx/20 group-hover/video:bg-onyx/40 transition-all duration-700">
                                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-onyx shadow-2xl group-hover/video:scale-110 transition-transform duration-500">
                                    <Play size={28} fill="currentColor" />
                                  </div>
                                </div>
                                <div className="absolute bottom-6 left-6 text-white text-[10px] font-bold uppercase tracking-[0.3em] bg-onyx/40 px-3 py-1 rounded-full backdrop-blur-md">
                                  Laundry Showcase Video
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        <motion.a
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          href={getWhatsAppLink(WHATSAPP_NUMBER_1, `Hello, I'd like to book your ${service.name} service.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-luxury w-full py-5 flex items-center justify-center gap-4 group/btn"
                        >
                          <MessageCircle size={20} className="text-green-400 group-hover/btn:scale-110 transition-transform" />
                          Book Service
                        </motion.a>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
