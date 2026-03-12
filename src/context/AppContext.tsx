import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Product, Service, FounderInfo, HomepageText, Order, Testimonial, Category, CartItem } from '../types';

interface AppContextType extends AppState {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateService: (service: Service) => void;
  addService: (service: Service) => void;
  deleteService: (id: string) => void;
  updateFounder: (founder: FounderInfo) => void;
  updateHomepage: (homepage: HomepageText) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  addTestimonial: (testimonial: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

interface ExtendedAppState extends AppState {
  orders: Order[];
  testimonials: Testimonial[];
  leads: any[];
  cart: CartItem[];
}

const defaultState: ExtendedAppState = {
  products: [],
  services: [],
  categories: [],
  founder: {
    name: "Tommy Emmy",
    image: "https://files.catbox.moe/wt9vok.jpg",
    vision: "To provide every household with access to quality food products and professional home services that improve quality of life through hygienic processing and expert craftsmanship."
  },
  homepage: {
    heroHeadline: "Healthy. Hygienic. Nutritious.",
    heroSubtext: "Premium Nigerian food products and reliable home services designed for healthy living."
  },
  orders: [],
  testimonials: [],
  leads: [],
  cart: []
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ExtendedAppState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from backend on mount
  useEffect(() => {
    const safeJson = async (res: Response, fallback: any = []) => {
      if (!res.ok) return fallback;
      try {
        const text = await res.text();
        if (!text) return fallback;
        return JSON.parse(text);
      } catch (e) {
        console.error('JSON parse error:', e);
        return fallback;
      }
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, servicesRes, testimonialsRes, ordersRes, contentRes, leadsRes] = await Promise.all([
          fetch('/api/products').then(res => safeJson(res)),
          fetch('/api/services').then(res => safeJson(res)),
          fetch('/api/testimonials').then(res => safeJson(res)),
          fetch('/api/orders').then(res => safeJson(res)),
          fetch('/api/content').then(res => safeJson(res, {})),
          fetch('/api/leads', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}` }
          }).then(res => safeJson(res))
        ]);

        setState(prev => ({
          ...prev,
          products: productsRes.length > 0 ? productsRes : prev.products,
          services: servicesRes.length > 0 ? servicesRes : prev.services,
          testimonials: testimonialsRes.length > 0 ? testimonialsRes : prev.testimonials,
          orders: ordersRes.length > 0 ? ordersRes : prev.orders,
          leads: leadsRes.length > 0 ? leadsRes : prev.leads,
          categories: contentRes.categories?.length > 0 ? contentRes.categories : prev.categories,
          founder: contentRes.founder || prev.founder,
          homepage: contentRes.homepage || prev.homepage,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addProduct = async (product: Product) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(product)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }
      const newProduct = await response.json();
      setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
    } catch (error: any) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(product)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }
      setState(prev => ({ ...prev, products: prev.products.map(p => p.id === product.id ? product : p) }));
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }
      setState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setState(prev => {
      const existing = prev.cart.find(item => item.id === product.id);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        };
      }
      return { ...prev, cart: [...prev.cart, { ...product, quantity }] };
    });
  };

  const removeFromCart = (productId: string) => {
    setState(prev => ({ ...prev, cart: prev.cart.filter(item => item.id !== productId) }));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(item => item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item)
    }));
  };

  const clearCart = () => setState(prev => ({ ...prev, cart: [] }));

  const addService = async (service: Service) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(service)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add service');
      }
      const newService = await response.json();
      setState(prev => ({ ...prev, services: [...prev.services, newService] }));
    } catch (error: any) {
      console.error('Error adding service:', error);
      throw error;
    }
  };

  const updateService = async (service: Service) => {
    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(service)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update service');
      }
      setState(prev => ({ ...prev, services: prev.services.map(s => s.id === service.id ? service : s) }));
    } catch (error: any) {
      console.error('Error updating service:', error);
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete service');
      }
      setState(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
    } catch (error: any) {
      console.error('Error deleting service:', error);
      throw error;
    }
  };

  const updateFounder = async (founder: FounderInfo) => {
    try {
      const response = await fetch('/api/content/founder', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(founder)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update founder' }));
        throw new Error(errorData.error || 'Failed to update founder');
      }
      setState(prev => ({ ...prev, founder }));
    } catch (error: any) {
      console.error('Error updating founder:', error);
      throw error;
    }
  };

  const updateHomepage = async (homepage: HomepageText) => {
    try {
      const response = await fetch('/api/content/homepage', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(homepage)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update homepage' }));
        throw new Error(errorData.error || 'Failed to update homepage');
      }
      setState(prev => ({ ...prev, homepage }));
    } catch (error: any) {
      console.error('Error updating homepage:', error);
      throw error;
    }
  };

  const addOrder = async (order: Order) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add order' }));
        throw new Error(errorData.error || 'Failed to add order');
      }
      const newOrder = await response.json();
      setState(prev => ({ ...prev, orders: [newOrder, ...prev.orders] }));
    } catch (error: any) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const updateOrder = async (order: Order) => {
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(order)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update order' }));
        throw new Error(errorData.error || 'Failed to update order');
      }
      setState(prev => ({ ...prev, orders: prev.orders.map(o => o.id === order.id ? order : o) }));
    } catch (error: any) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  const addTestimonial = async (testimonial: Testimonial) => {
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(testimonial)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add testimonial' }));
        throw new Error(errorData.error || 'Failed to add testimonial');
      }
      const newTestimonial = await response.json();
      setState(prev => ({ ...prev, testimonials: [newTestimonial, ...prev.testimonials] }));
    } catch (error: any) {
      console.error('Error adding testimonial:', error);
      throw error;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete testimonial' }));
        throw new Error(errorData.error || 'Failed to delete testimonial');
      }
      setState(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) }));
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  };

  const addCategory = async (category: Category) => {
    try {
      const response = await fetch('/api/content/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(category)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add category' }));
        throw new Error(errorData.error || 'Failed to add category');
      }
      const newCategory = await response.json();
      setState(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
    } catch (error: any) {
      console.error('Error adding category:', error);
      throw error;
    }
  };
  const updateCategory = async (category: Category) => {
    try {
      const response = await fetch(`/api/content/categories/${category.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(category)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update category' }));
        throw new Error(errorData.error || 'Failed to update category');
      }
      setState(prev => ({ ...prev, categories: prev.categories.map(c => c.id === category.id ? category : c) }));
    } catch (error: any) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/content/categories/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete category' }));
        throw new Error(errorData.error || 'Failed to delete category');
      }
      setState(prev => {
        const categoryToDelete = prev.categories.find(c => c.id === id);
        if (!categoryToDelete) return prev;
        
        const updatedProducts = prev.products.map(p => 
          p.category === categoryToDelete.name ? { ...p, category: 'uncategorized' } : p
        );
        
        return {
          ...prev,
          categories: prev.categories.filter(c => c.id !== id),
          products: updatedProducts
        };
      });
    } catch (error: any) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      ...state,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      addProduct, updateProduct, deleteProduct,
      addService, updateService, deleteService,
      updateFounder, updateHomepage,
      addOrder, updateOrder,
      addTestimonial, deleteTestimonial,
      addCategory, updateCategory, deleteCategory
    } as any}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
