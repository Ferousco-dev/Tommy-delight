import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DeliveryPage from './pages/DeliveryPage';
import RefundPage from './pages/RefundPage';
import ProfilePage from './pages/ProfilePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = !!localStorage.getItem('user_email');
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const isLoggedIn = !!localStorage.getItem('user_email');
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function AnimatedRoutes() {
  const location = useLocation();
  const [user, setUser] = React.useState(() => JSON.parse(localStorage.getItem('user_data') || 'null'));
  
  // Sync user state with localStorage changes
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user_data') || 'null');
    setUser(currentUser);
  }, [location.pathname]);

  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem('user_data') || 'null'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-grow relative"
      >
        <Routes location={location}>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={<AuthRoute><Home /></AuthRoute>} />
          <Route path="/about" element={<AuthRoute><AboutPage /></AuthRoute>} />
          <Route path="/products" element={<AuthRoute><ProductsPage /></AuthRoute>} />
          <Route path="/products/:id" element={<AuthRoute><ProductDetailPage /></AuthRoute>} />
          <Route path="/cart" element={<AuthRoute><CartPage /></AuthRoute>} />
          <Route path="/checkout" element={<AuthRoute><CheckoutPage /></AuthRoute>} />
          <Route path="/delivery" element={<AuthRoute><DeliveryPage /></AuthRoute>} />
          <Route path="/refund" element={<AuthRoute><RefundPage /></AuthRoute>} />
          <Route path="/services" element={<AuthRoute><ServicesPage /></AuthRoute>} />
          <Route path="/contact" element={<AuthRoute><ContactPage /></AuthRoute>} />
          <Route path="/profile" element={<AuthRoute><ProfilePage user={user} setUser={setUser} /></AuthRoute>} />
          
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col overflow-x-hidden relative">
          <div className="grain-overlay" />
          <div className="fixed inset-0 pointer-events-none z-[-1] bg-ivory" />
          
          <Navbar />
          <main className="flex flex-col flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}
