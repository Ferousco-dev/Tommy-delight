import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, ShieldCheck, Home, ShoppingBag, Zap, Info, MessageSquare, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { cn, getProxiedImageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { cart } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = React.useState(() => localStorage.getItem('is_admin') === 'true');
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => !!localStorage.getItem('user_email'));
  const [userName, setUserName] = React.useState(() => localStorage.getItem('user_name') || '');
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Sync auth state on route changes
  React.useEffect(() => {
    setIsAdmin(localStorage.getItem('is_admin') === 'true');
    setIsLoggedIn(!!localStorage.getItem('user_email'));
    setUserName(localStorage.getItem('user_name') || '');
  }, [location.pathname]);

  React.useEffect(() => {
    const handleStorage = () => {
      setIsAdmin(localStorage.getItem('is_admin') === 'true');
      setIsLoggedIn(!!localStorage.getItem('user_email'));
      setUserName(localStorage.getItem('user_name') || '');
    };
    window.addEventListener('storage', handleStorage);
    // Also poll for same-tab changes
    const interval = setInterval(handleStorage, 500);
    return () => { window.removeEventListener('storage', handleStorage); clearInterval(interval); };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={20} /> },
    { name: 'Products', href: '/products', icon: <ShoppingBag size={20} /> },
    { name: 'Services', href: '/services', icon: <Zap size={20} /> },
    { name: 'About', href: '/about', icon: <Info size={20} /> },
    { name: 'Contact', href: '/contact', icon: <MessageSquare size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_phone');
    localStorage.removeItem('user_data');
    localStorage.removeItem('supabase.auth.token');
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-700 hidden md:block',
          isScrolled ? 'bg-white/60 backdrop-blur-xl border-b border-white/40 py-4 shadow-sm' : 'bg-transparent py-8'
        )}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-onyx/5 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <img 
                  src={getProxiedImageUrl("https://files.catbox.moe/rywtuf.jpg")} 
                  alt="Tommy Delights Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-display font-bold tracking-tight text-onyx leading-none">Tommy Delights</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-onyx/40 leading-none mt-1">Integrated Services</span>
              </div>
            </Link>

            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-all hover:text-onyx relative group/link",
                    location.pathname === link.href ? "text-onyx" : "text-onyx/40"
                  )}
                >
                  {link.name}
                  {location.pathname === link.href && (
                    <motion.div 
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold"
                    />
                  )}
                </Link>
              ))}
              
              <div className="h-4 w-px bg-onyx/10 mx-2" />

              {isLoggedIn ? (
                <div className="flex items-center gap-6">
                  <Link to="/profile" className="relative group flex items-center gap-2">
                    <div className="p-2.5 rounded-xl bg-onyx/5 text-onyx group-hover:bg-onyx group-hover:text-white transition-all duration-500">
                      <UserIcon size={18} />
                    </div>
                    {userName && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-onyx/60 group-hover:text-onyx transition-colors hidden xl:inline max-w-[100px] truncate">
                        {userName.split(' ')[0]}
                      </span>
                    )}
                  </Link>
                  <Link to="/cart" className="relative group">
                    <div className="p-2.5 rounded-xl bg-onyx/5 text-onyx group-hover:bg-onyx group-hover:text-white transition-all duration-500">
                      <ShoppingCart size={18} />
                    </div>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-onyx text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 bg-onyx text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-onyx/90 transition-all shadow-md"
                    >
                      <LayoutDashboard size={14} />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="p-2 text-onyx/40 hover:text-red-600 transition-colors flex items-center gap-2"
                    title="Logout"
                  >
                    <LogOut size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest md:hidden lg:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 border border-onyx/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-onyx hover:text-white transition-all"
                >
                  <UserIcon size={14} />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-b border-stone-100 py-4 px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-onyx/5">
            <img 
              src={getProxiedImageUrl("https://files.catbox.moe/rywtuf.jpg")} 
              alt="Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-onyx">Tommy Delights</span>
        </Link>
        {isLoggedIn && (
          <Link to="/profile" className="p-2 rounded-xl bg-onyx/5 text-onyx">
            <UserIcon size={18} />
          </Link>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-stone-100 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navLinks.slice(0, 3).map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative",
                  isActive ? "text-onyx" : "text-onyx/40"
                )}
              >
                <motion.div
                  animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                >
                  {link.icon}
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  {link.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -top-0.5 w-6 h-1 bg-gold rounded-full"
                  />
                )}
              </Link>
            );
          })}

          <Link
            to="/cart"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative",
              location.pathname === '/cart' ? "text-onyx" : "text-onyx/40"
            )}
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-onyx text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight">Cart</span>
          </Link>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative text-red-500"
            >
              <LogOut size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Exit</span>
            </button>
          )}
          
          {isLoggedIn ? (
            <Link
              to={isAdmin ? "/admin" : "/profile"}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all",
                (location.pathname.startsWith('/admin') || location.pathname === '/profile') ? "text-onyx" : "text-onyx/40"
              )}
            >
              {isAdmin ? <LayoutDashboard size={20} /> : <UserIcon size={20} />}
              <span className="text-[10px] font-bold uppercase tracking-tight">{isAdmin ? 'Admin' : 'Profile'}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all",
                location.pathname === '/login' ? "text-onyx" : "text-onyx/40"
              )}
            >
              <UserIcon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Login</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
