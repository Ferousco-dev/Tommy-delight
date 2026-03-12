import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, ArrowLeft, Star, ShieldCheck, Truck, RefreshCcw, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getProxiedImageUrl, getWhatsAppLink, WHATSAPP_NUMBER_1 } from '../utils';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const product = useMemo(() => products.find(p => p.id === id), [products, id]);

  const images = useMemo(() => {
    if (!product) return [];
    const imgs = [product.image];
    if (product.images) {
      product.images.forEach(img => {
        if (!imgs.includes(img)) imgs.push(img);
      });
    }
    return imgs;
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-serif font-bold text-onyx mb-4">Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn-primary">Back to Products</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const message = `Hello Tommy Delights, I'd like to order ${quantity}x ${product.name}. Total: ₦${(parseInt(product.price.replace(/,/g, '')) * quantity).toLocaleString()}`;
    window.open(getWhatsAppLink(WHATSAPP_NUMBER_1, message), '_blank');
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-onyx transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-stone-50 relative">
              <img 
                src={getProxiedImageUrl(images[activeImage])} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              {product.stock && product.stock < 10 && (
                <div className="absolute top-8 left-8 bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                  Low Stock: {product.stock} left
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all flex-shrink-0 ${
                      activeImage === idx ? 'border-gold shadow-lg' : 'border-stone-50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={getProxiedImageUrl(img)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            <div className="glass-panel p-8 rounded-[2rem] shadow-xl border-white/20 hidden md:block mt-4">
              <div className="flex items-center gap-2 text-gold mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} 
                    className={i < Math.floor(product.rating || 5) ? "" : "text-stone-200"}
                  />
                ))}
                <span className="text-xs font-bold ml-2 text-onyx">{product.rating || '5.0'}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-onyx">Highly Recommended by Customers</p>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <div className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-4">{product.category}</div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-onyx mb-6 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 mb-8">
                <div className="text-3xl font-serif text-onyx">₦{product.price}</div>
                {product.stock && (
                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
                    In Stock
                  </div>
                )}
              </div>
              
              <div className="space-y-6 mb-10">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Description</h3>
                  <p className="text-stone-500 text-lg font-light leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {product.ingredients && (
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Ingredients</h3>
                    <p className="text-stone-600 font-medium italic">
                      {product.ingredients}
                    </p>
                  </div>
                )}

                {product.nutritionalInfo && (
                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Nutritional Information</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {product.nutritionalInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-stone-200 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-6 py-4 hover:bg-stone-50 transition-colors text-xl font-light"
                  >
                    -
                  </button>
                  <div className="px-6 py-4 font-bold text-lg min-w-[60px] text-center">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-6 py-4 hover:bg-stone-50 transition-colors text-xl font-light"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl ${
                    added ? 'bg-green-600 text-white' : 'bg-onyx text-white hover:bg-stone-800 shadow-onyx/10'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={20} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              <button 
                onClick={handleWhatsAppOrder}
                className="w-full py-5 border-2 border-onyx text-onyx rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-onyx hover:text-white transition-all group"
              >
                <MessageCircle size={20} className="text-green-500 group-hover:text-white transition-colors" />
                Order on WhatsApp
              </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-stone-100">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-onyx">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-onyx mb-1">Hygienic</h4>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest">100% Natural</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-onyx">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-onyx mb-1">Fast Delivery</h4>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest">Lagos & Beyond</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-onyx">
                  <RefreshCcw size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-onyx mb-1">Quality</h4>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest">Satisfaction Guaranteed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
