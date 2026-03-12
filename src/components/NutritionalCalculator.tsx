import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Info, CheckCircle2 } from 'lucide-react';

const products = [
  { name: 'Date Powder', calories: 282, fiber: 8, potassium: 656, iron: 1 },
  { name: 'Date Syrup', calories: 300, fiber: 2, potassium: 500, iron: 0.5 },
  { name: 'Tom Brown', calories: 380, fiber: 12, potassium: 400, iron: 4 },
  { name: '3 in 1 Ogi', calories: 350, fiber: 5, potassium: 300, iron: 2 },
];

export default function NutritionalCalculator() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [grams, setGrams] = useState(100);

  const calculate = (value: number) => {
    return ((value / 100) * grams).toFixed(1);
  };

  return (
    <div className="card-professional p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-onyx text-white rounded-xl flex items-center justify-center">
          <Calculator size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-onyx">Nutritional Calculator</h3>
          <p className="text-stone-500 text-sm">Plan your meals with precision</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-onyx/40 mb-3">Select Product</label>
          <div className="grid grid-cols-2 gap-2">
            {products.map((p) => (
              <button
                key={p.name}
                onClick={() => setSelectedProduct(p)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  selectedProduct.name === p.name 
                    ? 'bg-onyx text-white border-onyx shadow-lg' 
                    : 'bg-white text-onyx/60 border-onyx/5 hover:border-onyx/20'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-onyx/40 mb-3">Serving Size (grams)</label>
          <input 
            type="range" 
            min="10" 
            max="500" 
            step="10"
            value={grams}
            onChange={(e) => setGrams(parseInt(e.target.value))}
            className="w-full h-2 bg-onyx/5 rounded-lg appearance-none cursor-pointer accent-onyx"
          />
          <div className="flex justify-between mt-2 text-xs font-bold text-onyx/40">
            <span>10g</span>
            <span className="text-onyx text-sm">{grams}g</span>
            <span>500g</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          {[
            { label: 'Calories', value: calculate(selectedProduct.calories), unit: 'kcal' },
            { label: 'Fiber', value: calculate(selectedProduct.fiber), unit: 'g' },
            { label: 'Potassium', value: calculate(selectedProduct.potassium), unit: 'mg' },
            { label: 'Iron', value: calculate(selectedProduct.iron), unit: 'mg' },
          ].map((stat) => (
            <div key={stat.label} className="bg-onyx/5 p-4 rounded-2xl border border-onyx/5">
              <div className="text-xs font-bold uppercase tracking-widest text-onyx/40 mb-1">{stat.label}</div>
              <div className="text-xl font-bold text-onyx">
                {stat.value}
                <span className="text-xs ml-1 font-normal opacity-50">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 p-4 bg-gold/10 rounded-2xl border border-gold/20">
          <Info className="text-gold shrink-0" size={20} />
          <p className="text-xs text-onyx/70 leading-relaxed">
            These values are estimates based on standard processing. Tommy Delights products are 100% natural with no additives.
          </p>
        </div>
      </div>
    </div>
  );
}
