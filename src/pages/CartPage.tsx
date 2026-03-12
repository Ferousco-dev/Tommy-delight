import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getProxiedImageUrl, getWhatsAppLink, WHATSAPP_NUMBER_1 } from '../utils';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => {
    const price = parseInt(item.price.replace(/,/g, ''));
    return acc + (price * item.quantity);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center p-6 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8 text-stone-300">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-onyx mb-4">Your cart is empty</h2>
          <p className="text-stone-500 mb-10 max-w-xs mx-auto">Looks like you haven't added any gourmet delights to your cart yet.</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-onyx">Your Cart</h1>
          <button 
            onClick={clearCart}
            className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col sm:flex-row gap-6 p-6 bg-stone-50 rounded-[2rem] border border-stone-100 group"
                >
                  <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden shadow-md border-4 border-white">
                    <img 
                      src={getProxiedImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[9px] font-bold text-gold uppercase tracking-widest mb-1">{item.category}</div>
                        <Link to={`/products/${item.id}`}>
                          <h3 className="text-xl font-bold text-onyx mb-1 hover:text-stone-400 transition-colors">{item.name}</h3>
                        </Link>
                        <div className="text-lg font-serif text-onyx">₦{item.price}</div>
                        {item.stock && item.stock < 10 && (
                          <div className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-1">
                            Only {item.stock} left in stock
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-stone-300 hover:text-red-600 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 hover:bg-stone-50 transition-colors text-onyx/60"
                        >
                          -
                        </button>
                        <div className="px-4 py-2 font-bold text-sm min-w-[40px] text-center text-onyx">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 hover:bg-stone-50 transition-colors text-onyx/60"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-lg font-bold text-onyx">
                        ₦{(parseInt(item.price.replace(/,/g, '')) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-10 rounded-[3rem] border-white/40 shadow-xl sticky top-32">
              <h2 className="text-2xl font-serif font-bold text-onyx mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-stone-500 font-light">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-500 font-light">
                  <span>Delivery</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Calculated at checkout</span>
                </div>
                <div className="h-px bg-onyx/5 my-4" />
                <div className="flex justify-between text-2xl font-bold text-onyx">
                  <span>Total</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-5 flex items-center justify-center gap-3 mb-4"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
              
              <Link 
                to="/products"
                className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-onyx transition-colors"
              >
                <ArrowLeft size={14} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
