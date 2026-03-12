import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, ArrowLeft, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWhatsAppLink, WHATSAPP_NUMBER_1, getProxiedImageUrl } from '../utils';

export default function CheckoutPage() {
  const { cart, clearCart, addOrder } = useApp();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => {
    const price = parseInt(item.price.replace(/,/g, ''));
    return acc + (price * item.quantity);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const order = {
      id: Date.now().toString(),
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      items: cart,
      total_price: subtotal.toLocaleString(),
      status: 'pending' as const,
      created_at: new Date().toISOString()
    };

    addOrder(order);

    // Construct WhatsApp message
    const itemsList = cart.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
    const message = `Hello Tommy Delights, I'd like to place an order!\n\n*Customer Details:*\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\n\n*Order Items:*\n${itemsList}\n\n*Total:* ₦${subtotal.toLocaleString()}\n\nThank you!`;
    
    // Open WhatsApp
    window.open(getWhatsAppLink(WHATSAPP_NUMBER_1, message), '_blank');

    setIsSuccess(true);
    clearCart();
    setIsProcessing(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center p-6 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-onyx mb-4">Order Received!</h2>
          <p className="text-stone-500 mb-10 leading-relaxed">
            Thank you for your order. We've redirected you to WhatsApp to finalize the delivery details. Our team will contact you shortly.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary w-full">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center p-6 bg-white">
        <h2 className="text-2xl font-serif font-bold text-onyx mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="btn-primary">Go to Products</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-onyx transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-serif font-bold text-onyx mb-10">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Full Name</label>
                  <input 
                    name="name"
                    type="text"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-onyx focus:bg-white outline-none transition-all font-light"
                    placeholder="Tommy Emmy"
                    defaultValue={localStorage.getItem('user_name') || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">WhatsApp Phone Number</label>
                  <input 
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-onyx focus:bg-white outline-none transition-all font-light"
                    placeholder="+234..."
                    defaultValue={localStorage.getItem('user_phone') || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
                  <input 
                    name="email"
                    type="email"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-onyx focus:bg-white outline-none transition-all font-light"
                    placeholder="your@email.com"
                    defaultValue={localStorage.getItem('user_email') || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Delivery Address</label>
                  <textarea 
                    name="address"
                    required
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-onyx focus:bg-white outline-none transition-all font-light resize-none"
                    placeholder="Enter your full delivery address..."
                  />
                </div>
              </div>

              <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100">
                <div className="flex items-center gap-4 text-onyx mb-4">
                  <ShieldCheck size={20} className="text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">Secure Checkout</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Your order will be finalized on WhatsApp. This ensures personal attention and accurate delivery coordination.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-xl shadow-onyx/10 disabled:opacity-70"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Order on WhatsApp
                    <MessageCircle size={20} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Summary Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass-panel p-10 rounded-[3rem] border-white/40 shadow-xl">
              <h2 className="text-2xl font-serif font-bold text-onyx mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-stone-100">
                      <img src={getProxiedImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-onyx truncate">{item.name}</h4>
                      <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-onyx">
                      ₦{(parseInt(item.price.replace(/,/g, '')) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-onyx/5">
                <div className="flex justify-between text-stone-500 font-light">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-500 font-light">
                  <span>Delivery</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">TBD on WhatsApp</span>
                </div>
                <div className="h-px bg-onyx/5 my-4" />
                <div className="flex justify-between text-2xl font-bold text-onyx">
                  <span>Total</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-onyx">
                    <Truck size={18} />
                  </div>
                  <p className="text-xs text-stone-500 font-light">Fast delivery within Lagos and nationwide shipping available.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
