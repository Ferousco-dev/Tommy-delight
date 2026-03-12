import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../lib/authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, Testimonial, Order } from '../types';
import { Plus, Trash2, Edit2, LogOut, Package, MessageSquare, LayoutDashboard, X, Save, Upload, Image as ImageIcon, ShoppingCart, CheckCircle, Clock as ClockIcon, User, Phone, MapPin, AlertTriangle, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { cn, getProxiedImageUrl } from '../utils';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export default function Admin({ user, setUser }: { user: any, setUser: (user: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'testimonials' | 'orders' | 'content'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const founderImageRef = useRef<HTMLInputElement>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [siteContent, setSiteContent] = useState<any>({
    founder: { name: '', vision: '', image: '' },
    homepage: { heroHeadline: '', heroSubtext: '' }
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: 'food' as 'food' | 'service',
    message: '',
    status: 'pending' as 'pending' | 'completed' | 'cancelled'
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function fetchData() {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        const { data: testimonialsData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        const { data: ordersData } = await supabase.from('orders').select('*').order('order_date', { ascending: false });
        const { data: contentData } = await supabase.from('founder').select('*').eq('id', 1).maybeSingle();
        const { data: homeData } = await supabase.from('homepage').select('*').eq('id', 1).maybeSingle();
        
        setProducts(productsData || []);
        setTestimonials(testimonialsData || []);
        setOrders(ordersData || []);
        setSiteContent({
          founder: contentData || { name: '', vision: '', image: '' },
          homepage: homeData || { heroHeadline: '', heroSubtext: '' }
        });
      } else {
        // Local API fallback
        const [pRes, tRes, oRes, cRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/testimonials'),
          fetch('/api/orders'),
          fetch('/api/content')
        ]);
        
        if (pRes.ok) setProducts(await pRes.json());
        if (tRes.ok) setTestimonials(await tRes.json());
        if (oRes.ok) setOrders(await oRes.json());
        if (cRes.ok) {
          const content = await cRes.json();
          setSiteContent({
            founder: content.founder || { name: '', vision: '', image: '' },
            homepage: content.homepage || { heroHeadline: '', heroSubtext: '' }
          });
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Dashboard Stats
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    
    // Chart Data
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.order_date || o.created_at);
        return orderDate.toDateString() === d.toDateString();
      });
      return {
        name: dateStr,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
      };
    });

    const categoryData = [
      { name: 'Food', value: products.filter(p => p.category === 'food').length },
      { name: 'Services', value: products.filter(p => p.category === 'service').length }
    ];

    return { totalRevenue, completedOrders, pendingOrders, last7Days, categoryData };
  }, [orders, products]);

  const COLORS = ['#5A5A40', '#D4A373'];

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
  };

  const handleOpenModal = (item: any = null) => {
    setError(null);
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        image_url: item.image_url || '',
        category: item.category || 'food',
        message: item.message || '',
        status: item.status || 'pending'
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        category: 'food',
        message: '',
        status: 'pending'
      });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('reqtype', 'fileupload');
    formDataUpload.append('fileToUpload', file);

    try {
      const response = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://catbox.moe/user/api.php'), {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const url = await response.text();
        setFormData(prev => ({ ...prev, image_url: url.trim() }));
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again or use a direct URL.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (activeTab === 'products') {
      if (!formData.name.trim()) return setError('Product name is required');
      if (formData.price <= 0) return setError('Price must be greater than 0');
      if (!formData.image_url.trim()) return setError('Image URL is required');
    } else if (activeTab === 'testimonials') {
      if (!formData.name.trim()) return setError('Customer name is required');
      if (!formData.message.trim()) return setError('Testimonial message is required');
    }

    setLoading(true);

    const table = activeTab === 'dashboard' ? 'orders' : activeTab;
    const data = activeTab === 'products' 
      ? { name: formData.name, description: formData.description, price: formData.price, image_url: formData.image_url, category: formData.category }
      : activeTab === 'testimonials'
      ? { name: formData.name, message: formData.message }
      : { status: formData.status };

    try {
      if (isSupabaseConfigured) {
        if (editingItem) {
          const { error } = await supabase.from(table).update(data).eq('id', editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from(table).insert([data]);
          if (error) throw error;
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const method = editingItem ? 'PUT' : 'POST';
        const url = editingItem ? `/api/${table}/${editingItem.id}` : `/api/${table}`;
        const response = await fetch(url, {
          method,
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to save data');
        }
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from(activeTab).delete().eq('id', id);
        if (error) throw error;
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const response = await fetch(`/api/${activeTab}/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to delete item');
        }
      }
      setDeletingId(null);
      fetchData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-paper relative overflow-hidden">
      <div className="grain" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />

      {/* Horizontal Top Navigation */}
      <nav className="bg-ink text-white shadow-2xl sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-4 md:gap-16">
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-display leading-tight">Admin <span className="italic font-light text-white/60">Studio</span></h2>
                <p className="text-[8px] md:text-[10px] text-primary uppercase tracking-[0.4em] font-serif italic font-bold">Tommy Delights Integrated Services</p>
              </div>
              
              <div className="hidden lg:flex items-center gap-4">
                {[
                  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                  { id: 'products', icon: Package, label: 'Inventory' },
                  { id: 'orders', icon: ShoppingCart, label: 'Orders' },
                  { id: 'testimonials', icon: MessageSquare, label: 'Reviews' },
                  { id: 'content', icon: LayoutDashboard, label: 'Site Content' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-2.5 rounded-full transition-all duration-500 font-serif text-base border border-transparent",
                      activeTab === tab.id 
                        ? "bg-primary text-white shadow-xl shadow-primary/20 border-primary/20" 
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <LayoutDashboard size={24} />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 md:px-8 py-2 md:py-3 rounded-full hover:bg-red-500/10 text-red-400 transition-all duration-500 font-serif text-sm md:text-lg border border-red-500/20"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/5 bg-ink/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {[
                  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                  { id: 'products', icon: Package, label: 'Inventory' },
                  { id: 'orders', icon: ShoppingCart, label: 'Orders' },
                  { id: 'testimonials', icon: MessageSquare, label: 'Reviews' },
                  { id: 'content', icon: LayoutDashboard, label: 'Site Content' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-6 px-8 py-5 rounded-2xl transition-all duration-500 font-serif text-xl border border-transparent",
                      activeTab === tab.id 
                        ? "bg-primary text-white shadow-xl shadow-primary/20" 
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <tab.icon size={24} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-display text-ink capitalize mb-2">
              {activeTab === 'dashboard' ? 'Business Overview' : activeTab === 'products' ? 'Inventory' : activeTab}
            </h1>
            <p className="text-lg md:text-2xl text-muted font-serif italic">Precision management for Tommy Delights.</p>
          </div>
          {activeTab !== 'orders' && activeTab !== 'dashboard' && (
            <button
              onClick={() => handleOpenModal()}
              className="btn-primary flex items-center gap-4 px-8 py-4 text-lg shadow-2xl shadow-primary/20 w-full sm:w-auto justify-center"
            >
              <Plus size={24} />
              Add {activeTab === 'products' ? 'Item' : 'Review'}
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            {activeTab === 'dashboard' && (
              <div className="space-y-12">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
                    { label: 'Completed Orders', value: stats.completedOrders, icon: CheckCircle, color: 'bg-primary' },
                    { label: 'Pending Orders', value: stats.pendingOrders, icon: ClockIcon, color: 'bg-accent' },
                    { label: 'Active Products', value: products.length, icon: Package, color: 'bg-ink' }
                  ].map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-8 flex items-center gap-6"
                    >
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg", kpi.color)}>
                        <kpi.icon size={28} />
                      </div>
                      <div>
                        <p className="text-xs font-serif uppercase tracking-widest text-muted mb-1">{kpi.label}</p>
                        <h4 className="text-3xl font-display text-ink">{kpi.value}</h4>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 glass-card p-10">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-display">Revenue Trend</h3>
                      <div className="flex items-center gap-2 text-primary font-serif italic">
                        <TrendingUp size={18} />
                        <span>Last 7 Days</span>
                      </div>
                    </div>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.last7Days}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#5A5A40" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E8E' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E8E' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#5A5A40', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#5A5A40" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="lg:col-span-4 glass-card p-10 flex flex-col">
                    <h3 className="text-2xl font-display mb-10">Inventory Split</h3>
                    <div className="h-[300px] w-full flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {stats.categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-6">
                      {stats.categoryData.map((cat, i) => (
                        <div key={cat.name} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                            <span className="font-serif italic text-lg">{cat.name}</span>
                          </div>
                          <span className="font-display text-xl">{cat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card p-10">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-display">Recent Activity</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-primary font-serif italic hover:underline">View All Orders</button>
                  </div>
                  <div className="space-y-6">
                    {orders.slice(0, 5).map((order, i) => (
                      <div key={order.id} className="flex items-center justify-between p-6 bg-paper/50 rounded-2xl border border-primary/5">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Activity size={20} />
                          </div>
                          <div>
                            <p className="font-display text-lg">{order.product_name}</p>
                            <p className="text-sm font-serif italic text-muted">Ordered by {order.customer_name || order.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-lg">₦{order.total_amount?.toLocaleString()}</p>
                          <p className="text-xs font-serif uppercase tracking-widest text-primary">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-12">
                <div className="glass-card p-10">
                  <h3 className="text-3xl font-display text-ink mb-10">Founder Profile</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      const { data: { session } } = await supabase.auth.getSession();
                      const token = session?.access_token;
                      const res = await fetch('/api/content/founder', {
                        method: 'PUT',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(siteContent.founder)
                      });
                      if (res.ok) alert('Founder profile updated successfully');
                    } catch (err) {
                      console.error(err);
                      alert('Failed to update founder profile');
                    } finally {
                      setLoading(false);
                    }
                  }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted">Founder Name</label>
                        <input 
                          type="text"
                          className="w-full p-5 bg-paper border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-inner"
                          value={siteContent.founder.name}
                          onChange={(e) => setSiteContent({ ...siteContent, founder: { ...siteContent.founder, name: e.target.value } })}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted">Founder Image URL</label>
                        <div className="flex gap-4">
                          <input 
                            type="text"
                            className="flex-1 p-5 bg-paper border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-inner"
                            value={siteContent.founder.image}
                            onChange={(e) => setSiteContent({ ...siteContent, founder: { ...siteContent.founder, image: e.target.value } })}
                          />
                          <input 
                            type="file" 
                            ref={founderImageRef} 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploading(true);
                              const fd = new FormData();
                              fd.append('reqtype', 'fileupload');
                              fd.append('fileToUpload', file);
                              try {
                                const response = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://catbox.moe/user/api.php'), {
                                  method: 'POST',
                                  body: fd,
                                });
                                if (response.ok) {
                                  const url = await response.text();
                                  setSiteContent({ ...siteContent, founder: { ...siteContent.founder, image: url.trim() } });
                                }
                              } catch (err) {
                                console.error(err);
                              } finally {
                                setUploading(false);
                              }
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => founderImageRef.current?.click()}
                            className="px-6 bg-primary/5 text-primary rounded-[1.5rem] border border-primary/10 hover:bg-primary/10 transition-all"
                          >
                            <Upload size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted">Founder Vision</label>
                      <textarea 
                        rows={4}
                        className="w-full p-5 bg-paper border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-inner resize-none"
                        value={siteContent.founder.vision}
                        onChange={(e) => setSiteContent({ ...siteContent, founder: { ...siteContent.founder, vision: e.target.value } })}
                      />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-4">
                      <Save size={24} />
                      {loading ? 'Saving...' : 'Update Founder Profile'}
                    </button>
                  </form>
                </div>

                <div className="glass-card p-10">
                  <h3 className="text-3xl font-display text-ink mb-10">Homepage Content</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      const { data: { session } } = await supabase.auth.getSession();
                      const token = session?.access_token;
                      const res = await fetch('/api/content/homepage', {
                        method: 'PUT',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(siteContent.homepage)
                      });
                      if (res.ok) alert('Homepage content updated successfully');
                    } catch (err) {
                      console.error(err);
                      alert('Failed to update homepage content');
                    } finally {
                      setLoading(false);
                    }
                  }} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted">Hero Headline</label>
                      <input 
                        type="text"
                        className="w-full p-5 bg-paper border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-inner"
                        value={siteContent.homepage.heroHeadline}
                        onChange={(e) => setSiteContent({ ...siteContent, homepage: { ...siteContent.homepage, heroHeadline: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted">Hero Subtext</label>
                      <textarea 
                        rows={3}
                        className="w-full p-5 bg-paper border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-inner resize-none"
                        value={siteContent.homepage.heroSubtext}
                        onChange={(e) => setSiteContent({ ...siteContent, homepage: { ...siteContent.homepage, heroSubtext: e.target.value } })}
                      />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-4">
                      <Save size={24} />
                      {loading ? 'Saving...' : 'Update Homepage Content'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="grid grid-cols-1 gap-8">
                {products.map((product, idx) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="interactive-card p-10 flex flex-col md:flex-row items-center gap-12 group"
                  >
                    <div className="w-24 h-24 md:w-40 md:h-40 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex-shrink-0 shadow-2xl border-4 md:border-8 border-white group-hover:rotate-3 transition-all duration-700">
                      <img src={getProxiedImageUrl(product.image_url)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                        <h4 className="text-2xl md:text-3xl font-display text-ink">{product.name}</h4>
                        <span className="inline-block px-4 py-1 rounded-full bg-primary/5 text-primary text-[10px] md:text-xs font-serif uppercase tracking-[0.2em] w-fit mx-auto md:mx-0 border border-primary/10">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-lg md:text-xl text-muted font-serif italic leading-relaxed line-clamp-2 mb-4 md:mb-6">{product.description}</p>
                      <p className="text-primary font-display text-2xl md:text-3xl">₦{product.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto justify-center">
                      <button onClick={() => handleOpenModal(product)} className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-primary hover:bg-primary hover:text-white rounded-[1rem] md:rounded-[1.25rem] transition-all duration-500 border border-primary/10 shadow-sm">
                        <Edit2 size={20} />
                      </button>
                      {deletingId === product.id ? (
                        <div className="flex gap-2 md:gap-3">
                          <button onClick={() => handleDelete(product.id)} className="px-4 md:px-8 py-2 md:py-3 bg-red-500 text-white font-serif italic rounded-full text-sm md:text-lg shadow-lg shadow-red-500/20">Confirm</button>
                          <button onClick={() => setDeletingId(null)} className="px-4 md:px-8 py-2 md:py-3 bg-paper text-ink font-serif italic rounded-full text-sm md:text-lg border border-ink/10">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(product.id)} className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white rounded-[1rem] md:rounded-[1.25rem] transition-all duration-500 border border-red-100 shadow-sm">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="grid grid-cols-1 gap-8">
                {testimonials.map((testimonial, idx) => (
                  <motion.div 
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="interactive-card p-10 flex items-center gap-12 group"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-[1rem] md:rounded-[1.5rem] flex items-center justify-center text-primary font-display text-2xl md:text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl md:text-3xl font-display text-ink mb-2 md:mb-3">{testimonial.name}</h4>
                      <p className="text-lg md:text-2xl text-muted font-serif italic leading-relaxed">"{testimonial.message}"</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto justify-end">
                      <button onClick={() => handleOpenModal(testimonial)} className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-primary hover:bg-primary hover:text-white rounded-[1rem] md:rounded-[1.25rem] transition-all duration-500 border border-primary/10 shadow-sm">
                        <Edit2 size={20} />
                      </button>
                      {deletingId === testimonial.id ? (
                        <div className="flex gap-2 md:gap-3">
                          <button onClick={() => handleDelete(testimonial.id)} className="px-4 md:px-8 py-2 md:py-3 bg-red-500 text-white font-serif italic rounded-full text-sm md:text-lg shadow-lg shadow-red-500/20">Confirm</button>
                          <button onClick={() => setDeletingId(null)} className="px-4 md:px-8 py-2 md:py-3 bg-paper text-ink font-serif italic rounded-full text-sm md:text-lg border border-ink/10">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(testimonial.id)} className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white rounded-[1rem] md:rounded-[1.25rem] transition-all duration-500 border border-red-100 shadow-sm">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 gap-8">
                {orders.map((order, idx) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="interactive-card p-10 flex flex-col md:flex-row md:items-center gap-12 group"
                  >
                    <div className="w-20 h-20 bg-accent/5 rounded-[2rem] flex items-center justify-center text-accent shadow-inner group-hover:rotate-12 transition-transform duration-500">
                      <ShoppingCart size={40} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-6 mb-4">
                        <h4 className="text-3xl font-display text-ink">{order.product_name}</h4>
                        <span className={cn(
                          "text-xs font-serif uppercase tracking-[0.2em] px-6 py-1.5 rounded-full border",
                          order.status === 'completed' ? "bg-green-50 text-green-600 border-green-100" :
                          order.status === 'cancelled' ? "bg-red-50 text-red-600 border-red-100" :
                          "bg-primary/5 text-primary border-primary/10"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-12 text-xl text-muted font-serif italic">
                        <span className="flex items-center gap-4"><User size={20} className="text-primary/40" /> {order.customer_name || order.email || 'Guest'}</span>
                        <span className="flex items-center gap-4"><Phone size={20} className="text-primary/40" /> {order.phone || 'No Phone'}</span>
                        <span className="flex items-center gap-4 md:col-span-2"><MapPin size={20} className="text-primary/40" /> {order.address || 'No Address'}</span>
                        <span className="flex items-center gap-4"><ClockIcon size={20} className="text-primary/40" /> {new Date(order.created_at || order.order_date).toLocaleDateString()}</span>
                        <span className="text-primary font-display text-4xl md:text-right">₦{order.total_amount?.toLocaleString() || order.total_price?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => handleOpenModal(order)} className="w-14 h-14 flex items-center justify-center text-primary hover:bg-primary hover:text-white rounded-[1.25rem] transition-all duration-500 border border-primary/10 shadow-sm">
                        <Edit2 size={24} />
                      </button>
                      {deletingId === order.id ? (
                        <div className="flex gap-3">
                          <button onClick={() => handleDelete(order.id)} className="px-8 py-3 bg-red-500 text-white font-serif italic rounded-full text-lg shadow-lg shadow-red-500/20">Confirm</button>
                          <button onClick={() => setDeletingId(null)} className="px-8 py-3 bg-paper text-ink font-serif italic rounded-full text-lg border border-ink/10">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(order.id)} className="w-14 h-14 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white rounded-[1.25rem] transition-all duration-500 border border-red-100 shadow-sm">
                          <Trash2 size={24} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-ink/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-primary/5 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-10 border-b border-primary/5 flex justify-between items-center bg-paper/50 flex-shrink-0">
                <div>
                  <h3 className="text-2xl md:text-3xl font-display text-ink">
                    {editingItem ? 'Edit' : 'Add New'} {activeTab === 'products' ? 'Item' : activeTab === 'testimonials' ? 'Review' : 'Order'}
                  </h3>
                  <p className="text-sm md:text-lg text-muted font-serif italic">Admin management console</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/5 rounded-full transition-all">
                  <X className="w-6 h-6 md:w-7 md:h-7" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:y-8 overflow-y-auto custom-scrollbar flex-1">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-5 bg-red-50 border border-red-100 text-red-700 text-lg font-serif italic rounded-[1.5rem] flex items-center gap-4"
                  >
                    <AlertTriangle size={20} />
                    {error}
                  </motion.div>
                )}
                
                {activeTab === 'products' ? (
                  <>
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Product Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tommy's Tombrown"
                        className="w-full p-4 md:p-5 bg-paper border border-primary/5 rounded-[1.25rem] md:rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg md:text-xl shadow-inner"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] md:text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Price (₦)</label>
                        <input
                          type="number"
                          required
                          className="w-full p-4 md:p-5 bg-paper border border-primary/5 rounded-[1.25rem] md:rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg md:text-xl shadow-inner"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] md:text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Category</label>
                        <select
                          className="w-full p-4 md:p-5 bg-paper border border-primary/5 rounded-[1.25rem] md:rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg md:text-xl shadow-inner appearance-none"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        >
                          <option value="food">Food</option>
                          <option value="service">Service</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Visual Representation</label>
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4 w-full">
                          <input
                            type="url"
                            required
                            placeholder="Image URL (or upload below)"
                            className="w-full p-5 bg-paper border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-inner"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          />
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileUpload}
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                              className="flex items-center gap-3 px-8 py-3 bg-primary/5 text-primary rounded-full text-sm font-serif uppercase tracking-widest hover:bg-primary/10 transition-all border border-primary/10"
                            >
                              <Upload size={18} />
                              {uploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                            {formData.image_url && (
                              <span className="text-sm text-green-600 font-serif italic flex items-center gap-2">
                                <CheckCircle size={16} /> Asset Ready
                              </span>
                            )}
                          </div>
                        </div>
                        {formData.image_url && (
                          <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
                            <img 
                              src={getProxiedImageUrl(formData.image_url)} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Product Description</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe this item..."
                        className="w-full p-4 md:p-5 bg-paper border border-primary/5 rounded-[1.25rem] md:rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg md:text-xl shadow-inner resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </>
                ) : activeTab === 'testimonials' ? (
                  <>
                    <div className="space-y-3">
                      <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Guest Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Johnson"
                        className="w-full p-5 bg-paper border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-xl shadow-inner"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Testimonial Message</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="The guest's experience in their own words..."
                        className="w-full p-5 bg-paper border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-xl shadow-inner resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Order Status</label>
                      <div className="relative">
                        <select
                          className="w-full p-5 bg-paper border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-xl shadow-inner appearance-none"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        >
                          <option value="pending">Pending Review</option>
                          <option value="completed">Fulfilled</option>
                          <option value="cancelled">Archived</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-8 bg-paper rounded-[2rem] space-y-4 border border-primary/5 shadow-inner">
                      <p className="text-xs font-serif uppercase tracking-[0.3em] text-primary font-bold mb-6">Order Dossier</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg font-serif italic text-muted">
                        <p><strong>Product:</strong> <span className="text-ink">{editingItem?.product_name}</span></p>
                        <p><strong>Amount:</strong> <span className="text-primary font-display">₦{editingItem?.total_amount?.toLocaleString()}</span></p>
                        <p><strong>Customer:</strong> <span className="text-ink">{editingItem?.email}</span></p>
                        <p><strong>Phone:</strong> <span className="text-ink">{editingItem?.phone}</span></p>
                        <p className="sm:col-span-2"><strong>Sanctuary Address:</strong> <br /><span className="text-ink">{editingItem?.address || 'Not provided'}</span></p>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="pt-8 flex flex-col sm:flex-row gap-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 bg-paper text-muted rounded-full font-serif italic text-xl border border-primary/5 hover:bg-primary/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-5 bg-primary text-white rounded-full font-serif text-xl hover:bg-secondary transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 disabled:opacity-70"
                  >
                    <Save size={24} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
