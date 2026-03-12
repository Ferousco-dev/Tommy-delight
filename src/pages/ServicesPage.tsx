import React from 'react';
import Services from '../components/Services';
import ServiceEstimator from '../components/ServiceEstimator';
import { motion } from 'framer-motion';

export default function ServicesPage() {
  return (
    <div className="pt-20 bg-stone-50">
      <Services />
      
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <ServiceEstimator />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-onyx mb-8 leading-tight">
                Instant <span className="text-stone-400 italic">Estimates</span>
              </h2>
              <p className="text-lg text-stone-500 font-light leading-relaxed mb-10">
                Planning your home maintenance shouldn't be a guessing game. Use our instant estimator to get a clear idea of the costs for our professional laundry, painting, and cleaning services.
              </p>
              <div className="space-y-4">
                {['Transparent Pricing', 'No Hidden Charges', 'Professional Assessment', 'Quality Guaranteed'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-onyx/60 font-medium">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
