import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { getProxiedImageUrl, cn, getWhatsAppLink, WHATSAPP_NUMBER_1 } from '../utils';
import { useApp } from '../context/AppContext';

export default function Products() {
  const { products, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['all', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <section id="products" className="py-32 relative overflow-hidden bg-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[30%] h-[30%] bg-stone-50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] bg-stone-50 rounded-full blur-[100px]" />
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
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-onyx">The Gourmet Collection</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 1 }}
            className="text-3xl sm:text-5xl md:text-8xl font-serif font-bold text-onyx mb-10 leading-[0.85] tracking-tighter"
          >
            Hygienic <span className="text-stone-400 italic">Delights</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Explore our curated range of 100% natural, hygienically processed food products designed for the discerning palate.
          </motion.p>
        </div>

        {/* Advanced Filter Bar */}
        <div className="mb-20 flex flex-col md:flex-row gap-8 items-center justify-between glass-panel p-8 rounded-[3rem] border-white/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)]">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-onyx/30" size={22} />
            <input
              type="text"
              placeholder="Search the collection..."
              className="w-full pl-16 pr-8 py-5 bg-white/50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-onyx/5 transition-all font-light text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-4 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap",
                  selectedCategory === cat 
                    ? 'bg-onyx text-white shadow-2xl shadow-onyx/20' 
                    : 'bg-white/50 text-onyx/40 hover:bg-white hover:text-onyx border border-stone-50'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col h-full"
              >
                <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden mb-10 relative shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border-[12px] border-stone-50 transition-all duration-700 group-hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15)] group-hover:-translate-y-2">
                  <img
                    src={getProxiedImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-8 left-8 flex flex-col gap-2">
                    <div className="glass-panel border-white/20 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-2xl">
                      {product.category}
                    </div>
                    {product.stock && product.stock < 10 && (
                      <div className="bg-red-500/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest text-white">
                        Only {product.stock} left
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center gap-4">
                    <Link 
                      to={`/products/${product.id}`}
                      className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-onyx shadow-2xl hover:scale-110 transition-transform"
                      title="View Details"
                    >
                      <Search size={24} />
                    </Link>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-onyx shadow-2xl hover:scale-110 transition-transform"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={24} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col flex-1 px-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-2xl font-serif text-onyx leading-tight group-hover:text-stone-400 transition-colors duration-500">{product.name}</h3>
                    </Link>
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-serif text-onyx">₦{product.price}</span>
                      {product.rating && (
                        <div className="flex items-center gap-1 text-gold mt-1">
                          <span className="text-[10px] font-bold">{product.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={cn("w-2.5 h-2.5", i < Math.floor(product.rating || 0) ? "fill-current" : "text-stone-200 fill-current")} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-stone-500 text-sm mb-10 line-clamp-2 leading-relaxed flex-1 font-light">
                    {product.description}
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 btn-luxury py-4 flex items-center justify-center gap-3 group/btn"
                    >
                      <ShoppingBag size={18} />
                      Add to Cart
                    </button>
                    <a
                      href={getWhatsAppLink(WHATSAPP_NUMBER_1, `Hello, I'd like to order ${product.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-stone-50 text-onyx rounded-2xl border border-stone-100 hover:bg-onyx hover:text-white transition-all group/wa"
                    >
                      <MessageCircle size={20} className="text-green-500 group-hover/wa:text-white transition-colors" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-40 glass-panel rounded-[4rem] border-white/40">
            <ShoppingBag className="mx-auto text-onyx/5 mb-8" size={80} />
            <p className="text-stone-400 text-2xl font-light mb-10">No products found matching your search.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-onyx font-bold uppercase tracking-[0.3em] text-[10px] underline underline-offset-8 hover:text-stone-400 transition-all"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
