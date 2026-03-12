import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../lib/authService';
import { supabase } from '../lib/supabase';
import { User as UserIcon, Phone, Mail, ShieldCheck, LogOut, Package, Clock, Calendar, ArrowUpDown, MapPin, Save, Edit2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils';

export default function ProfilePage({ user, setUser }: { user: any, setUser: (user: any) => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    address: ''
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('order_date', { ascending: sortOrder === 'asc' });
      
      if (error) {
        if (error.code === '42P01') {
          setOrders([]);
          return;
        }
        throw error;
      }
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Update auth metadata as well
      await authService.updateUser({
        data: { 
          full_name: profileData.full_name,
          phone: profileData.phone
        }
      });

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setSaveError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  const isStaff = 
    user.email?.endsWith('@tommydelights.com') || 
    user.email === 'founder@tommydelights.com' ||
    user.email === 'tommydelight@gmail.com' ||
    user.user_metadata?.role === 'admin';

  return (
    <div className="min-h-screen bg-paper pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Textures */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary p-10 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center border border-white/20 shadow-2xl">
                <UserIcon size={64} className="text-white/90" />
              </div>
              <div className="text-center md:text-left flex-1">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-6xl font-display mb-4"
                >
                  {profileData.full_name || user.user_metadata?.full_name || 'Member'}
                </motion.h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <span className="flex items-center gap-3 text-white/70 font-serif italic text-xl">
                    <Mail size={20} /> {user.email}
                  </span>
                  {isStaff && (
                    <span className="bg-accent text-white px-5 py-1.5 rounded-full text-xs font-serif uppercase tracking-[0.2em] flex items-center gap-2 border border-white/20">
                      <ShieldCheck size={16} /> Admin Access
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full font-serif text-lg transition-all flex items-center gap-3"
              >
                {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-10 md:p-16">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-display text-ink">Personal Details</h2>
                  <p className="text-muted font-serif italic">Update your profile</p>
                </div>
                
                {saveError && (
                  <div className="p-5 bg-red-50 text-red-600 rounded-[1.5rem] text-lg font-serif italic border border-red-100">
                    {saveError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Full Name</label>
                    <input 
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      className="w-full p-5 bg-paper rounded-[1.5rem] outline-none border border-primary/5 focus:border-primary/20 transition-all font-serif text-xl italic"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Phone Number</label>
                    <input 
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full p-5 bg-paper rounded-[1.5rem] outline-none border border-primary/5 focus:border-primary/20 transition-all font-serif text-xl italic"
                      placeholder="Your contact"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Delivery Address</label>
                    <textarea 
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="w-full p-5 bg-paper rounded-[1.5rem] outline-none border border-primary/5 focus:border-primary/20 transition-all font-serif text-xl italic min-h-[150px] resize-none"
                      placeholder="Where should we deliver your orders?"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-6 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-10 py-4 bg-paper text-muted rounded-full font-serif text-xl hover:bg-primary/5 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    disabled={profileLoading}
                    className="btn-primary flex items-center gap-3"
                  >
                    {profileLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={22} />
                    )}
                    Save Profile
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <h2 className="text-4xl font-display text-ink">Account Overview</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 p-6 bg-paper rounded-[2rem] border border-primary/5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-serif uppercase tracking-[0.2em] text-muted mb-1">Contact</p>
                        <p className="text-xl font-serif italic text-ink">{profileData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 bg-paper rounded-[2rem] border border-primary/5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-serif uppercase tracking-[0.2em] text-muted mb-1">Delivery</p>
                        <p className="text-xl font-serif italic text-ink">{profileData.address || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 bg-paper rounded-[2rem] border border-primary/5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-serif uppercase tracking-[0.2em] text-muted mb-1">Member Since</p>
                        <p className="text-xl font-serif italic text-ink">{new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <h2 className="text-4xl font-display text-ink">Quick Actions</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {isStaff && (
                      <button 
                        onClick={() => navigate('/admin')}
                        className="flex items-center justify-between p-8 bg-primary/5 text-primary rounded-[2rem] border border-primary/10 hover:bg-primary/10 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <ShieldCheck size={24} />
                          <span className="text-2xl font-display">Admin Dashboard</span>
                        </div>
                        <ArrowUpDown size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                    <button 
                      onClick={() => navigate('/products')}
                      className="flex items-center justify-between p-8 bg-accent/5 text-accent rounded-[2rem] border border-accent/10 hover:bg-accent/10 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <Package size={24} />
                        <span className="text-2xl font-display">Browse Products</span>
                      </div>
                      <ArrowUpDown size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center justify-between p-8 bg-red-50/30 text-red-600 rounded-[2rem] border border-red-100 hover:bg-red-50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <LogOut size={24} />
                        <span className="text-2xl font-display">Sign Out</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order History Section */}
          <div className="p-10 md:p-16 bg-paper/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl font-display text-ink mb-2">Order History</h2>
                <p className="text-muted font-serif italic text-xl">Your journey with us</p>
              </div>
              <button 
                onClick={() => {
                  const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                  setSortOrder(newOrder);
                  fetchOrders();
                }}
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full text-lg font-serif italic text-muted hover:text-primary transition-colors border border-primary/5 shadow-sm"
              >
                <ArrowUpDown size={20} />
                Sort by {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-muted font-serif italic text-xl">Retrieving your history...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white rounded-[2.5rem] gap-8 hover:shadow-xl transition-all duration-500 border border-primary/5 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-paper rounded-2xl flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                        <Package size={32} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-[10px] font-serif uppercase tracking-[0.2em] text-muted">ID: {order.id.slice(0, 8)}</p>
                          <span className={cn(
                            "text-[10px] font-serif uppercase tracking-widest px-3 py-0.5 rounded-full border",
                            order.status === 'completed' ? "bg-green-50 text-green-600 border-green-100" :
                            order.status === 'cancelled' ? "bg-red-50 text-red-600 border-red-100" :
                            "bg-accent/5 text-accent border-accent/10"
                          )}>
                            {order.status}
                          </span>
                        </div>
                        <h3 className="text-2xl font-display text-ink">{order.product_name}</h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-10">
                      <div className="flex items-center gap-3 text-muted font-serif italic text-lg">
                        <Calendar size={20} className="text-primary/30" />
                        <span>{new Date(order.order_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="text-3xl font-display text-primary">
                        <span className="text-lg font-serif italic mr-1">₦</span>
                        {order.total_amount.toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-primary/10">
                <Package size={64} className="mx-auto text-primary/10 mb-6" />
                <p className="text-muted font-serif italic text-2xl mb-8">Your history is a blank canvas.</p>
                <button 
                  onClick={() => navigate('/products')}
                  className="btn-primary"
                >
                  Discover Products
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
