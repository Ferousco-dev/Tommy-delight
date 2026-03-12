import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, Globe, ShieldCheck, MapPin } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif font-bold text-onyx mb-6">Delivery Information</h1>
          <p className="text-stone-500 text-lg font-light">How we get our gourmet delights to your doorstep.</p>
        </motion.div>

        <div className="space-y-12">
          <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-onyx text-white flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-onyx">Delivery Areas</h2>
            </div>
            <p className="text-stone-600 leading-relaxed mb-6">
              We currently offer doorstep delivery across **Lagos State**. For customers outside Lagos, we facilitate shipping via reliable interstate transport services or logistics partners (GIGM, Waybill, etc.).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <h4 className="font-bold text-onyx mb-1">Lagos Island</h4>
                <p className="text-xs text-stone-400">VI, Lekki, Ajah, Ikoyi</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <h4 className="font-bold text-onyx mb-1">Lagos Mainland</h4>
                <p className="text-xs text-stone-400">Ikeja, Surulere, Magodo, etc.</p>
              </div>
            </div>
          </section>

          <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-onyx text-white flex items-center justify-center">
                <Clock size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-onyx">Processing Time</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Orders are typically processed within **24-48 hours**. Since our products are hygienically prepared to ensure freshness, some specialty items might require additional time. We will communicate the exact timeline via WhatsApp once your order is placed.
            </p>
          </section>

          <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-onyx text-white flex items-center justify-center">
                <Truck size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-onyx">Delivery Rates</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Delivery fees are calculated based on your specific location and the weight of the items. The final delivery cost will be confirmed during our WhatsApp conversation after you checkout.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
