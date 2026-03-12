import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Testimonial } from '../types';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        let data = null;
        if (isSupabaseConfigured) {
          const result = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });
          data = result.data;
        }

        if (!data) {
          const response = await fetch('/api/testimonials');
          if (response.ok) {
            data = await response.json();
          }
        }

        if (data) {
          setTestimonials(data);
        } else {
          setTestimonials([
            {
              id: '1',
              name: 'Sarah Johnson',
              message: 'The Tombrown is a lifesaver for my kids. They love the taste and I love the nutrition!',
              created_at: new Date().toISOString()
            },
            {
              id: '2',
              name: 'Michael Okoro',
              message: 'Best laundry service in town. My clothes always come back smelling fresh and perfectly ironed.',
              created_at: new Date().toISOString()
            },
            {
              id: '3',
              name: 'Blessing Adebayo',
              message: 'They painted my new apartment and the finish is absolutely professional. Highly recommended!',
              created_at: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error('Testimonials error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-stone-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-stone-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-onyx/5 border border-onyx/10 mb-10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-onyx">The Voice of Excellence</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif text-onyx mb-10 leading-[1.1] tracking-tight"
          >
            Community <span className="text-stone-400 italic">Voices</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 max-w-2xl mx-auto text-xl font-light leading-relaxed"
          >
            Hear from our cherished community about their experiences with our gourmet products and professional transformations.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-16 h-16 border-2 border-onyx/10 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -15 }}
                className="bg-stone-50 p-12 rounded-[3rem] border border-stone-100 relative group transition-all duration-500 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)]"
              >
                <Quote className="absolute top-10 right-12 text-stone-200 group-hover:text-gold/20 transition-colors duration-500" size={64} />
                <div className="flex gap-1.5 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-onyx text-xl leading-relaxed mb-10 font-serif italic font-light">
                  "{testimonial.message}"
                </p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-onyx text-white flex items-center justify-center font-serif text-2xl shadow-xl group-hover:bg-gold group-hover:text-onyx transition-colors duration-500">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-onyx text-lg tracking-tight">{testimonial.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Verified Client</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
