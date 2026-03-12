import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Instagram, MessageCircle, MapPin, Clock, Send, Music, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { getWhatsAppLink, WHATSAPP_NUMBER_1, WHATSAPP_NUMBER_2 } from '../utils';

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-stone-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-stone-200/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Contact Info Side */}
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
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-onyx/5 border border-onyx/10 mb-10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-onyx">Concierge Services</span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif text-onyx mb-10 leading-[1.1] tracking-tight">
              Let's Start a <span className="italic text-stone-400">Conversation</span>
            </h2>
            
            <p className="text-xl text-stone-500 mb-16 max-w-lg leading-relaxed font-light">
              Experience the pinnacle of service. Whether it's a gourmet request or a professional home transformation, our team is ready.
            </p>

            <div className="space-y-12">
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex gap-8 items-start group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-onyx shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 flex-shrink-0 group-hover:bg-onyx group-hover:text-white transition-all duration-500">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-onyx mb-2">Direct Lines</h4>
                  <div className="space-y-1">
                    <p className="text-stone-500 font-light text-lg">{WHATSAPP_NUMBER_1}</p>
                    <p className="text-stone-500 font-light text-lg">{WHATSAPP_NUMBER_2}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex gap-8 items-start group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 flex-shrink-0 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                  <MessageCircle size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-onyx mb-2">WhatsApp Concierge</h4>
                  <div className="flex flex-col gap-3 mt-3">
                    <a
                      href={getWhatsAppLink(WHATSAPP_NUMBER_1, "Hello Tommy Delights, I'm interested in your food products.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-500 hover:text-onyx font-medium flex items-center gap-3 transition-all group/link"
                    >
                      <span className="text-sm uppercase tracking-widest">Food Orders</span>
                      <ArrowRightIcon size={16} className="group-hover/link:translate-x-2 transition-transform" />
                    </a>
                    <a
                      href={getWhatsAppLink(WHATSAPP_NUMBER_2, "Hello Tommy Delights, I'd like to book a home service.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-500 hover:text-onyx font-medium flex items-center gap-3 transition-all group/link"
                    >
                      <span className="text-sm uppercase tracking-widest">Service Booking</span>
                      <ArrowRightIcon size={16} className="group-hover/link:translate-x-2 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex gap-8 items-start group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-pink-600 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 flex-shrink-0 group-hover:bg-pink-600 group-hover:text-white transition-all duration-500">
                  <Instagram size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-onyx mb-2">Social Presence</h4>
                  <div className="flex flex-col gap-3 mt-3">
                    <a href="https://instagram.com/tomcredel" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-onyx font-medium flex items-center gap-3 transition-all group/link">
                      <span className="text-sm uppercase tracking-widest">@tomcredel</span>
                      <ArrowRightIcon size={16} className="group-hover/link:translate-x-2 transition-transform" />
                    </a>
                    <a href="https://tiktok.com/@tommydelight0" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-onyx font-medium flex items-center gap-3 transition-all group/link">
                      <span className="text-sm uppercase tracking-widest">@tommydelight0</span>
                      <ArrowRightIcon size={16} className="group-hover/link:translate-x-2 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] border border-stone-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform duration-700" />
              
              <form className="space-y-8" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const payload = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  subject: formData.get('subject'),
                  message: formData.get('message'),
                };
                
                try {
                  const res = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  if (res.ok) {
                    alert('Message sent successfully! We will get back to you soon.');
                    (e.target as HTMLFormElement).reset();
                  } else {
                    const data = await res.json();
                    alert(`Error: ${data.error || 'Failed to send message'}`);
                  }
                } catch (err) {
                  alert('Failed to send message. Please try again later.');
                }
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 ml-1">Your Name</label>
                    <input
                      name="name"
                      type="text"
                      className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-onyx focus:bg-white outline-none transition-all font-light"
                      placeholder="Tommy Emmy"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 ml-1">Your Email</label>
                    <input
                      name="email"
                      type="email"
                      className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-onyx focus:bg-white outline-none transition-all font-light"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 ml-1">Subject</label>
                  <input
                    name="subject"
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-onyx focus:bg-white outline-none transition-all font-light"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 ml-1">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-onyx focus:bg-white outline-none transition-all resize-none font-light"
                    placeholder="Share your thoughts..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-luxury w-full py-5 flex items-center justify-center gap-4 group/btn">
                  <Send size={20} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                  Send Message
                </button>
              </form>
            </div>

            <div className="w-full h-[350px] rounded-[3rem] overflow-hidden shadow-2xl relative border border-stone-100 group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126844.0634860224!2d3.33624!3d6.524379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a397c9a9d3!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1625561234567!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Tommy Delights Location"
                className="grayscale contrast-125 group-hover:grayscale-0 transition-all duration-1000"
              ></iframe>
              
              <div className="absolute bottom-8 left-8 right-8 glass-panel border-white/20 p-8 rounded-[2rem] shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-onyx text-white rounded-2xl flex items-center justify-center shadow-2xl">
                    <Clock size={28} />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white">Opening Hours</h5>
                    <p className="text-sm text-white/60 font-light">Mon - Sat: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const ArrowRight = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
