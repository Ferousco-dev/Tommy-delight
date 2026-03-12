import React from 'react';
import Products from '../components/Products';
import NutritionalCalculator from '../components/NutritionalCalculator';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  return (
    <div className="pt-20 bg-white">
      <Products />
      
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-onyx mb-8 leading-tight">
                Know Your <span className="text-stone-400 italic">Nutrition</span>
              </h2>
              <p className="text-lg text-stone-500 font-light leading-relaxed mb-10">
                At Tommy Delights, we believe in transparency. Use our interactive calculator to understand the nutritional value of our hygienically processed products and plan your healthy lifestyle with precision.
              </p>
              <div className="space-y-4">
                {['100% Natural Ingredients', 'No Artificial Preservatives', 'Hygienically Processed', 'Rich in Essential Nutrients'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-onyx/60 font-medium">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <NutritionalCalculator />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
