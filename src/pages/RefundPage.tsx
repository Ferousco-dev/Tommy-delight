import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif font-bold text-onyx mb-6">Refund & Return Policy</h1>
          <p className="text-stone-500 text-lg font-light">Our commitment to your satisfaction.</p>
        </motion.div>

        <div className="space-y-12">
          <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-onyx text-white flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-onyx">Quality Guarantee</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              At Tommy Delights, we take immense pride in the quality and hygiene of our products. Every item is carefully inspected before dispatch. However, if you receive a product that does not meet our high standards, we are here to help.
            </p>
          </section>

          <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-onyx text-white flex items-center justify-center">
                <RefreshCcw size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-onyx">Returns</h2>
            </div>
            <p className="text-stone-600 leading-relaxed mb-6">
              Due to the perishable and consumable nature of our food products, we can only accept returns if:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-stone-600">
                <CheckCircle2 size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <span>The item was damaged during delivery.</span>
              </li>
              <li className="flex items-start gap-3 text-stone-600">
                <CheckCircle2 size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <span>The wrong item was delivered.</span>
              </li>
              <li className="flex items-start gap-3 text-stone-600">
                <CheckCircle2 size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <span>The product has a quality defect upon arrival.</span>
              </li>
            </ul>
            <p className="mt-6 text-stone-600 italic text-sm">
              *Please report any issues within 24 hours of delivery with photographic evidence.
            </p>
          </section>

          <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-onyx text-white flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-onyx">Refunds</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed via bank transfer within 3-5 business days, or you may opt for a replacement item.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
