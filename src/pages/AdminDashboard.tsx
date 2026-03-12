import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wrench, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  MessageSquare,
  MessageCircle,
  User as UserIcon,
  Home as HomeIcon,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  List,
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Service, Order, Category } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    products, addProduct, updateProduct, deleteProduct,
    services, addService, updateService, deleteService,
    categories, addCategory, updateCategory, deleteCategory,
    founder, updateFounder,
    homepage, updateHomepage,
    orders, updateOrder,
    leads
  } = useApp();

  useEffect(() => {
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (!isAdmin) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_phone');
    localStorage.removeItem('user_data');
    localStorage.removeItem('supabase.auth.token');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
    { icon: List, label: 'Categories', path: '/admin/categories' },
    { icon: Wrench, label: 'Services', path: '/admin/services' },
    { icon: ImageIcon, label: 'Media', path: '/admin/media' },
    { icon: Clock, label: 'Orders', path: '/admin/orders' },
    { icon: MessageSquare, label: 'Leads', path: '/admin/leads' },
    { icon: UserIcon, label: 'Founder', path: '/admin/founder' },
    { icon: HomeIcon, label: 'Homepage', path: '/admin/homepage' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row pt-20">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 bg-white border-r border-stone-200 fixed h-[calc(100vh-80px)] overflow-y-auto z-30">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Management</h2>
            <nav className="space-y-1">
              {navItems.slice(0, 5).map((item) => {
                const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/');
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-onyx text-white shadow-md' 
                        : 'text-stone-500 hover:bg-stone-50 hover:text-onyx'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-gold' : ''} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Settings</h2>
            <nav className="space-y-1">
              {navItems.slice(5).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-onyx text-white shadow-md' 
                        : 'text-stone-500 hover:bg-stone-50 hover:text-onyx'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-gold' : ''} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        <div className="p-6 mt-auto border-t border-stone-100 bg-white sticky bottom-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden bg-white border-b border-stone-200 sticky top-20 z-20 overflow-x-auto no-scrollbar">
        <div className="flex p-4 gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/');
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-xs font-bold uppercase tracking-widest ${
                  isActive 
                    ? 'bg-onyx text-white shadow-md' 
                    : 'text-stone-500 bg-stone-50'
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-xs font-bold uppercase tracking-widest text-red-500 bg-red-50"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-stone-50/50 min-h-[calc(100vh-80px)]">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Overview products={products} services={services} orders={orders} leads={leads} />} />
            <Route path="/products" element={<ProductManager products={products} categories={categories} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} />} />
            <Route path="/categories" element={<CategoryManager categories={categories} onAdd={addCategory} onUpdate={updateCategory} onDelete={deleteCategory} />} />
            <Route path="/services" element={<ServiceManager services={services} onAdd={addService} onUpdate={updateService} onDelete={deleteService} />} />
            <Route path="/media" element={<MediaManager />} />
            <Route path="/orders" element={<OrderManager orders={orders} onUpdate={updateOrder} />} />
            <Route path="/leads" element={<LeadManager leads={leads} />} />
            <Route path="/founder" element={<FounderManager founder={founder} onUpdate={updateFounder} />} />
            <Route path="/homepage" element={<HomepageManager homepage={homepage} onUpdate={updateHomepage} />} />
            <Route path="/settings" element={<SettingsManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// --- Sub-components ---

const Overview = ({ products, services, orders, leads }: any) => {
  const stats = [
    { label: 'Total Products', value: products.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Services', value: services.length, icon: Wrench, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Orders', value: orders.filter((o: any) => o.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'New Leads', value: leads.length, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-onyx">Dashboard Overview</h1>
        <p className="text-stone-500 mt-1">Manage your business content and orders</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-onyx">{stat.value}</div>
            <div className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-bold text-onyx">Recent Orders</h3>
          <Link to="/admin/orders" className="text-xs font-bold text-stone-400 hover:text-onyx uppercase tracking-widest transition-colors">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {orders.length > 0 ? orders.slice(0, 5).map((order: any) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-onyx">{order.customer_name}</div>
                    <div className="flex flex-col gap-1">
                      <a 
                        href={`https://wa.me/${order.customer_phone.replace(/\+/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 flex items-center gap-1 hover:underline"
                      >
                        <MessageCircle size={12} />
                        {order.customer_phone}
                      </a>
                      {order.customer_email && (
                        <div className="text-[10px] text-stone-400 flex items-center gap-1">
                          <Mail size={10} />
                          {order.customer_email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    <div className="flex flex-col gap-1">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img src={item.image} alt="" className="w-6 h-6 rounded object-cover" />
                          <span>{item.name} x{item.quantity}</span>
                        </div>
                      )) || `${order.product_name} x${order.quantity}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-stone-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-stone-400 text-sm italic">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MediaManager = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-onyx">Media Library</h1>
      </div>
      <div className="bg-white p-12 rounded-[2.5rem] border border-stone-200 text-center">
        <ImageIcon size={64} className="mx-auto text-stone-200 mb-6" />
        <h3 className="text-xl font-bold text-onyx mb-2">Media Management</h3>
        <p className="text-stone-500 max-w-md mx-auto">
          Upload and manage your brand assets here. Currently, you can use direct URLs in the Product and Service managers.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button className="btn-primary py-3 px-6">Upload New Asset</button>
        </div>
      </div>
    </div>
  );
};

const OrderManager = ({ orders, onUpdate }: any) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-onyx">Orders</h1>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-stone-400">#{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-onyx">{order.customer_name}</div>
                  <div className="flex flex-col gap-1">
                    <a 
                      href={`https://wa.me/${order.customer_phone.replace(/\+/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 flex items-center gap-1 hover:underline"
                    >
                      <MessageCircle size={12} />
                      {order.customer_phone}
                    </a>
                    {order.customer_email && (
                      <div className="text-xs text-stone-400 flex items-center gap-1">
                        <Mail size={12} />
                        {order.customer_email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
                        <div className="text-xs">
                          <div className="font-bold text-onyx">{item.name}</div>
                          <div className="text-stone-400">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-sm text-stone-600">{order.product_name} x {order.quantity}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => onUpdate({ ...order, status: e.target.value as any })}
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-stone-50 border-none focus:ring-0 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ImageInput = ({ name, defaultValue, label, onChange, hidePreview }: { name: string, defaultValue?: string, label: string, onChange?: (val: string) => void, hidePreview?: boolean }) => {
  const [value, setValue] = useState(defaultValue || '');
  const [preview, setPreview] = useState(defaultValue || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setValue(base64);
        setPreview(base64);
        if (onChange) onChange(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (val: string) => {
    setValue(val);
    setPreview(val);
    if (onChange) onChange(val);
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{label}</label>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <input 
            type="text" 
            name={name} 
            value={value} 
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Image URL or base64"
            className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx text-sm"
          />
          <label className="cursor-pointer px-4 py-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-all flex items-center justify-center text-onyx">
            <ImageIcon size={18} />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        {!hidePreview && preview && (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 group">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => { handleTextChange(''); }}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const LeadManager = ({ leads }: any) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-onyx">Leads</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leads.map((lead: any) => (
          <div key={lead.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative group">
            <div className="absolute top-6 right-6 w-8 h-8 bg-stone-50 rounded-lg flex items-center justify-center text-stone-400 group-hover:bg-onyx group-hover:text-white transition-all">
              <MessageSquare size={16} />
            </div>
            <div className="text-[9px] font-bold text-gold uppercase tracking-widest mb-2">{lead.status}</div>
            <h3 className="text-lg font-bold text-onyx mb-1">{lead.name}</h3>
            <p className="text-xs text-stone-400 mb-4">{lead.email}</p>
            <div className="p-4 bg-stone-50 rounded-xl text-sm text-stone-600 italic">
              "{lead.message}"
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-stone-400">{new Date(lead.created_at).toLocaleDateString()}</span>
              <button className="text-[10px] font-bold uppercase tracking-widest text-onyx hover:underline">Mark Read</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MultiImageInput = ({ name, defaultValues, label }: { name: string, defaultValues?: string[], label: string }) => {
  const [images, setImages] = useState<string[]>(defaultValues || []);

  const addImage = (val: string) => {
    if (val && !images.includes(val)) {
      setImages([...images, val]);
    }
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{label}</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <div className="aspect-square">
          <ImageInput 
            name={`${name}_add`} 
            label="Add" 
            onChange={(val) => { if (val) { addImage(val); } }}
            hidePreview
          />
        </div>
      </div>
      <input type="hidden" name={name} value={images.join(',')} />
    </div>
  );
};

const ProductManager = ({ products, categories, onAdd, onUpdate, onDelete }: any) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const productData = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      image: formData.get('image') as string,
      images: (formData.get('images') as string)?.split(',').map(s => s.trim()).filter(Boolean),
      category: formData.get('category') as string,
      ingredients: formData.get('ingredients') as string,
      nutritionalInfo: formData.get('nutritionalInfo') as string,
      stock: parseInt(formData.get('stock') as string) || 0,
      rating: parseFloat(formData.get('rating') as string) || 5.0,
    };

    if (editingProduct) {
      onUpdate(productData);
    } else {
      onAdd(productData);
    }
    setEditingProduct(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-onyx">Products</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary py-2 px-4"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-onyx/40 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button onClick={() => setEditingProduct(product)} className="p-3 bg-white rounded-full text-onyx hover:scale-110 transition-transform"><Edit2 size={18} /></button>
                <button onClick={() => onDelete(product.id)} className="p-3 bg-white rounded-full text-red-600 hover:scale-110 transition-transform"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] font-bold text-gold uppercase tracking-widest">{product.category}</div>
                <div className="flex md:hidden gap-2">
                  <button onClick={() => setEditingProduct(product)} className="p-1.5 bg-stone-50 rounded-lg text-onyx"><Edit2 size={14} /></button>
                  <button onClick={() => onDelete(product.id)} className="p-1.5 bg-stone-50 rounded-lg text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-onyx mb-1">{product.name}</h3>
              <p className="text-sm text-stone-500 line-clamp-2 mb-4">{product.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="text-lg font-bold text-onyx">₦{product.price}</div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-green-600 uppercase tracking-widest">
                  <MessageCircle size={14} />
                  WhatsApp Ready
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(isAdding || editingProduct) && (
          <div className="fixed inset-0 bg-onyx/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-onyx">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => { setEditingProduct(null); setIsAdding(false); }} className="p-2 hover:bg-stone-50 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Name</label>
                  <input name="name" defaultValue={editingProduct?.name} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Price (₦)</label>
                    <input name="price" defaultValue={editingProduct?.price} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Category</label>
                    <select name="category" defaultValue={editingProduct?.category} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" required>
                      {categories.map((cat: Category) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                      <option value="uncategorized">Uncategorized</option>
                    </select>
                  </div>
                </div>
                <ImageInput name="image" defaultValue={editingProduct?.image} label="Main Image" />
                <MultiImageInput name="images" defaultValues={editingProduct?.images} label="Additional Images" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Stock</label>
                    <input name="stock" type="number" defaultValue={editingProduct?.stock} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Rating (0-5)</label>
                    <input name="rating" type="number" step="0.1" defaultValue={editingProduct?.rating} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Ingredients</label>
                  <input name="ingredients" defaultValue={editingProduct?.ingredients} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" placeholder="e.g. Corn, Ginger, Cloves" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nutritional Info</label>
                  <input name="nutritionalInfo" defaultValue={editingProduct?.nutritionalInfo} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" placeholder="e.g. High in Fiber, No added sugar" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Description</label>
                  <textarea name="description" defaultValue={editingProduct?.description} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx h-24" required />
                </div>
                <button type="submit" className="btn-primary w-full py-4 mt-4">Save Product</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryManager = ({ categories, onAdd, onUpdate, onDelete }: any) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const categoryData = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.get('name') as string,
    };

    if (editingCategory) {
      onUpdate(categoryData);
    } else {
      onAdd(categoryData);
    }
    setEditingCategory(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-onyx">Product Categories</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary py-2 px-4"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category: Category) => (
          <div key={category.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-onyx">
                <List size={20} />
              </div>
              <h3 className="font-bold text-onyx">{category.name}</h3>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditingCategory(category)} className="p-2 hover:bg-stone-50 rounded-lg text-onyx transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => onDelete(category.id)} className="p-2 hover:bg-stone-50 rounded-lg text-red-600 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(isAdding || editingCategory) && (
          <div className="fixed inset-0 bg-onyx/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-onyx">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={() => { setEditingCategory(null); setIsAdding(false); }} className="p-2 hover:bg-stone-50 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Category Name</label>
                  <input name="name" defaultValue={editingCategory?.name} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" required />
                </div>
                <button type="submit" className="btn-primary w-full py-4 mt-4">Save Category</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceManager = ({ services, onAdd, onUpdate, onDelete }: any) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const serviceData = {
      id: editingService?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      image: formData.get('image') as string,
      category: formData.get('category') as any,
      videoUrl: formData.get('videoUrl') as string,
    };

    if (editingService) {
      onUpdate(serviceData);
    } else {
      onAdd(serviceData);
    }
    setEditingService(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-onyx">Services</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary py-2 px-4"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service: Service) => (
          <div key={service.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-onyx text-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  {service.image ? (
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <Wrench size={24} />
                  )}
                </div>
                <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingService(service)} className="p-2 bg-stone-50 rounded-lg text-onyx hover:bg-onyx hover:text-white transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => onDelete(service.id)} className="p-2 bg-stone-50 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">{service.category}</div>
              <h3 className="text-xl font-bold text-onyx mb-2">{service.name}</h3>
              <p className="text-sm text-stone-500 mb-4 line-clamp-2">{service.description}</p>
              
              <div className="flex items-center justify-between">
                {service.price && (
                  <div className="text-sm font-bold text-onyx">₦{service.price}</div>
                )}
                {service.videoUrl && (
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Video
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(isAdding || editingService) && (
          <div className="fixed inset-0 bg-onyx/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-onyx">{editingService ? 'Edit Service' : 'Add Service'}</h2>
                <button onClick={() => { setEditingService(null); setIsAdding(false); }} className="p-2 hover:bg-stone-50 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Service Name</label>
                  <input name="name" defaultValue={editingService?.name} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Category</label>
                  <select name="category" defaultValue={editingService?.category} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" required>
                    <option value="Food Processing">Food Processing</option>
                    <option value="Professional Services">Professional Services</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Price (₦)</label>
                    <input name="price" defaultValue={editingService?.price} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Video URL (Optional)</label>
                    <input name="videoUrl" defaultValue={editingService?.videoUrl} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx" placeholder="https://..." />
                  </div>
                </div>
                <ImageInput name="image" defaultValue={editingService?.image} label="Service Image" />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Description</label>
                  <textarea name="description" defaultValue={editingService?.description} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-onyx h-24" required />
                </div>
                <button type="submit" className="btn-primary w-full py-4 mt-4">Save Service</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FounderManager = ({ founder, onUpdate }: any) => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onUpdate({
      name: formData.get('name') as string,
      image: formData.get('image') as string,
      vision: formData.get('vision') as string,
    });
    alert('Founder information updated successfully!');
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-4xl font-bold text-onyx">Founder Profile</h1>
      <form onSubmit={handleSave} className="bg-white p-10 rounded-[3rem] border border-stone-200 shadow-sm space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Founder Name</label>
          <input name="name" defaultValue={founder.name} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-onyx transition-all" required />
        </div>
        <ImageInput name="image" defaultValue={founder.image} label="Founder Image" />
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Vision Statement</label>
          <textarea name="vision" defaultValue={founder.vision} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-onyx transition-all h-48" required />
        </div>
        <button type="submit" className="w-full py-5 bg-onyx text-white rounded-2xl font-bold hover:bg-onyx/90 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
          <Save size={18} />
          Update Founder Profile
        </button>
      </form>
    </div>
  );
};

const HomepageManager = ({ homepage, onUpdate }: any) => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onUpdate({
      heroHeadline: formData.get('heroHeadline') as string,
      heroSubtext: formData.get('heroSubtext') as string,
    });
    alert('Homepage text updated successfully!');
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-4xl font-bold text-onyx">Hero Content</h1>
      <form onSubmit={handleSave} className="bg-white p-10 rounded-[3rem] border border-stone-200 shadow-sm space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Hero Headline</label>
          <input name="heroHeadline" defaultValue={homepage.heroHeadline} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-onyx transition-all" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Hero Subtext</label>
          <textarea name="heroSubtext" defaultValue={homepage.heroSubtext} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-onyx transition-all h-40" required />
        </div>
        <button type="submit" className="w-full py-5 bg-onyx text-white rounded-2xl font-bold hover:bg-onyx/90 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
          <Save size={18} />
          Update Hero Content
        </button>
      </form>
    </div>
  );
};

const SettingsManager = () => {
  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold text-onyx">Settings</h1>
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-onyx">General</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                <span className="text-sm text-stone-600">Maintenance Mode</span>
                <div className="w-10 h-5 bg-stone-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-onyx">Security</h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-stone-50 rounded-xl text-sm text-stone-600 text-left hover:bg-stone-100 transition-colors">
                Change Admin Password
              </button>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-stone-100">
          <button className="btn-primary w-full py-4">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
