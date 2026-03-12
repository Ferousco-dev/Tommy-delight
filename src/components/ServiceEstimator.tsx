import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppLink, WHATSAPP_NUMBER_1 } from '../utils';

const services = [
  { name: 'Laundry', basePrice: 500, unit: 'item', icon: '🧺' },
  { name: 'Painting', basePrice: 1500, unit: 'sqm', icon: '🎨' },
  { name: 'Cleaning', basePrice: 2000, unit: 'room', icon: '🧹' },
  { name: 'Decoration', basePrice: 5000, unit: 'room', icon: '✨' },
];

export default function ServiceEstimator() {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [quantity, setQuantity] = useState(1);

  const calculateTotal = () => {
    return (selectedService.basePrice * quantity).toLocaleString();
  };

  return (
    <div className="card-professional p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-onyx text-white rounded-xl flex items-center justify-center">
          <Wrench size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-onyx">Service Estimator</h3>
          <p className="text-stone-500 text-sm">Get an instant quote for your needs</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-onyx/40 mb-3">Select Service</label>
          <div className="grid grid-cols-2 gap-2">
            {services.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedService(s)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${
                  selectedService.name === s.name 
                    ? 'bg-onyx text-white border-onyx shadow-lg' 
                    : 'bg-white text-onyx/60 border-onyx/5 hover:border-onyx/20'
                }`}
              >
                <span>{s.icon}</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-onyx/40 mb-3">Quantity ({selectedService.unit}s)</label>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-xl bg-onyx/5 border border-onyx/5 flex items-center justify-center text-xl font-bold hover:bg-onyx/10 transition-colors"
            >
              -
            </button>
            <div className="flex-1 text-center text-2xl font-bold text-onyx">
              {quantity}
            </div>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 rounded-xl bg-onyx/5 border border-onyx/5 flex items-center justify-center text-xl font-bold hover:bg-onyx/10 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-onyx p-8 rounded-3xl text-white text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Estimated Total</div>
          <div className="text-4xl font-bold mb-1">₦{calculateTotal()}</div>
          <div className="text-[10px] opacity-40 uppercase tracking-widest">Subject to site inspection</div>
        </div>

        <motion.a
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          href={getWhatsAppLink(WHATSAPP_NUMBER_1, `Hello, I'd like to book ${quantity} ${selectedService.unit}(s) of ${selectedService.name} service. Estimated total: ₦${calculateTotal()}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-onyx text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-onyx/90 transition-all shadow-xl shadow-onyx/10 group"
        >
          Book Now
          <MessageCircle size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
        </motion.a>

        <div className="space-y-2">
          {['Professional Staff', 'Hygienic Standards', 'Prompt Service'].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-xs font-bold text-onyx/40">
              <CheckCircle2 size={14} className="text-onyx/20" />
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
