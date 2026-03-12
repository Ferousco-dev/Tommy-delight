import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Mail, ArrowRight, Eye, EyeOff, User, MessageCircle,
  ChevronDown, CheckCircle2, Sparkles
} from 'lucide-react';
import { getProxiedImageUrl } from '../utils';
import { authService } from '../lib/authService';

const COUNTRY_CODES = [
  { code: '+234', flag: '🇳🇬' },
  { code: '+233', flag: '🇬🇭' },
  { code: '+254', flag: '🇰🇪' },
  { code: '+27',  flag: '🇿🇦' },
  { code: '+1',   flag: '🇺🇸' },
  { code: '+44',  flag: '🇬🇧' },
  { code: '+91',  flag: '🇮🇳' },
  { code: '+971', flag: '🇦🇪' },
];

const ADMIN_IDENTIFIERS = ['tommydelight@gmail.com', 'admin@tommydelights.com'];

const FloatingParticle = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gold/40"
    style={{ left: x, top: y }}
    animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
    transition={{ duration: 4 + delay, repeat: Infinity, delay }}
  />
);

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+234');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => { if (d.country_calling_code) setCountryCode(d.country_calling_code); })
      .catch(() => {});
  }, []);

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: authError } = isLogin
        ? await authService.signIn(email, password)
        : await authService.signUp(email, password, {
            full_name: name,
            phone: `${countryCode}${phone}`,
          });

      if (authError) {
        const msg = (authError as any).message || (authError as any).error || 'Authentication failed';
        throw new Error(msg);
      }

      if (data && (data.session || data.user)) {
        const user = data.user || data.session?.user;
        if (user) {
          if (data.session) {
            localStorage.setItem('supabase.auth.token', data.session.access_token);
          }
          localStorage.setItem('user_email', user.email);
          const displayName = user.user_metadata?.full_name || user.user_metadata?.name || name || user.email.split('@')[0];
          localStorage.setItem('user_name', displayName);
          localStorage.setItem('user_phone', user.user_metadata?.phone || '');
          localStorage.setItem('user_data', JSON.stringify(user));

          const isStaff =
            user.email?.endsWith('@tommydelights.com') ||
            ADMIN_IDENTIFIERS.includes(user.email?.toLowerCase()) ||
            user.user_metadata?.role === 'admin';
          localStorage.setItem('is_admin', isStaff ? 'true' : 'false');

          setSuccessName(displayName);
          setSuccess(true);

          setTimeout(() => {
            if (isStaff) navigate('/admin');
            else navigate('/');
          }, 1800);
        }
      } else if (!isLogin) {
        setIsLogin(true);
        setError('Account created! Please check your email, then sign in.');
      }
    } catch (err: any) {
      const msg = err.message || 'An error occurred';
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('network')) {
        setError('Connection failed. Please check your internet connection.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = "w-full bg-white/70 border border-stone-200/80 rounded-xl outline-none transition-all duration-200 text-onyx placeholder:text-stone-300 font-sans text-sm focus:bg-white focus:border-onyx/30 focus:ring-2 focus:ring-onyx/5 shadow-sm";

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: 'linear-gradient(135deg, #FDFCF8 0%, #f7f5ef 100%)' }}>
      {/* LEFT PANEL */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col"
      >
        <div className="absolute inset-0">
          <img
            src={getProxiedImageUrl("https://files.catbox.moe/6g32kg.jpg")}
            alt="Tommy Delights"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-onyx/85 via-onyx/70 to-onyx/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.12) 0%, transparent 60%)' }} />
        </div>

        <FloatingParticle delay={0} x="15%" y="20%" />
        <FloatingParticle delay={1.5} x="75%" y="35%" />
        <FloatingParticle delay={0.8} x="40%" y="65%" />
        <FloatingParticle delay={2.2} x="85%" y="75%" />

        <div className="relative z-10 flex flex-col h-full p-14 justify-between">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-lg">
              <img src={getProxiedImageUrl("https://files.catbox.moe/rywtuf.jpg")} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="text-white text-sm font-display font-bold leading-none">Tommy Delights</p>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] leading-none mt-1">Integrated Services</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <div className="w-10 h-0.5 bg-gold mb-8" />
            <h1 className="text-5xl xl:text-6xl font-display font-bold text-white leading-[1.05] mb-6 tracking-tight">
              Healthy.<br /><span className="text-gold">Hygienic.</span><br />Nutritious.
            </h1>
            <p className="text-white/60 text-lg font-light leading-relaxed max-w-sm">
              Premium Nigerian food products and reliable home services — crafted for families who deserve the best.
            </p>
            <div className="flex flex-col gap-3 mt-10">
              {['Quality Certified Products', 'Trusted by 500+ Families', 'Fast & Reliable Delivery'].map((item, i) => (
                <motion.div key={item} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.1 }} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={11} className="text-gold" />
                  </div>
                  <span className="text-white/50 text-xs font-medium tracking-wide">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="border-l-2 border-gold/40 pl-4">
            <p className="text-white/40 text-xs font-light italic leading-relaxed">
              "Excellence in every detail, from our kitchen to your table."
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gold/5 blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-stone-200/40 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-onyx/10 shadow-sm">
              <img src={getProxiedImageUrl("https://files.catbox.moe/rywtuf.jpg")} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="text-onyx text-sm font-display font-bold leading-none">Tommy Delights</p>
              <p className="text-onyx/30 text-[9px] font-bold uppercase tracking-[0.2em] leading-none mt-1">Integrated Services</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="w-20 h-20 bg-onyx rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-onyx/20">
                  <Sparkles size={36} className="text-gold" />
                </motion.div>
                <h2 className="text-3xl font-display font-bold text-onyx mb-2">
                  Welcome{successName ? `, ${successName.split(' ')[0]}` : ''}!
                </h2>
                <p className="text-stone-400 font-light mb-8">Taking you to your dashboard…</p>
                <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.8 }} className="h-full bg-gradient-to-r from-gold/60 to-onyx rounded-full" />
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-8">
                  <AnimatePresence mode="wait">
                    <motion.div key={isLogin ? 'login-title' : 'signup-title'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                      <h2 className="text-4xl font-display font-bold text-onyx mb-2 leading-tight">
                        {isLogin ? 'Welcome back' : 'Join the family'}
                      </h2>
                      <p className="text-stone-400 font-light text-sm">
                        {isLogin ? 'Sign in to access your account and orders.' : 'Create your account to get started today.'}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Toggle */}
                <div className="flex bg-stone-100/80 p-1 rounded-xl mb-8 shadow-inner">
                  {(['Sign In', 'Create Account'] as const).map((label, i) => (
                    <button key={label} type="button" onClick={() => i === 0 ? (!isLogin && switchMode()) : (isLogin && switchMode())}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${(i === 0 ? isLogin : !isLogin) ? 'bg-onyx text-white shadow-lg' : 'text-stone-400 hover:text-onyx'}`}>
                      {label}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 20 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-medium flex items-start gap-2.5 overflow-hidden">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    <motion.div key={isLogin ? 'login-fields' : 'signup-fields'} initial={{ opacity: 0, x: isLogin ? -12 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isLogin ? 12 : -12 }} transition={{ duration: 0.3 }} className="space-y-4">
                      
                      {!isLogin && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Full Name</label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-onyx transition-colors" size={16} />
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className={`${inputBase} pl-10 pr-4 py-3.5`} placeholder="Tommy Emmy" required={!isLogin} />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-onyx transition-colors" size={16} />
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`${inputBase} pl-10 pr-4 py-3.5`} placeholder="you@email.com" required autoComplete="email" />
                        </div>
                      </div>

                      {!isLogin && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">WhatsApp Number</label>
                          <div className="flex gap-2">
                            <div className="relative">
                              <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="appearance-none bg-white/70 border border-stone-200/80 rounded-xl pl-3 pr-7 py-3.5 text-sm text-onyx outline-none focus:border-onyx/30 shadow-sm cursor-pointer">
                                {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                              </select>
                              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                            </div>
                            <div className="relative group flex-1">
                              <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-onyx transition-colors" size={16} />
                              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={`${inputBase} pl-10 pr-4 py-3.5`} placeholder="8012345678" required={!isLogin} />
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Password</label>
                          {isLogin && <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-onyx transition-colors">Forgot?</button>}
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-onyx transition-colors" size={16} />
                          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className={`${inputBase} pl-10 pr-12 py-3.5`} placeholder="••••••••" required autoComplete={isLogin ? 'current-password' : 'new-password'} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-onyx transition-colors">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {!isLogin && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Confirm Password</label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-onyx transition-colors" size={16} />
                            <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                              className={`${inputBase} pl-10 pr-12 py-3.5 ${confirmPassword && confirmPassword !== password ? 'border-red-300' : confirmPassword && confirmPassword === password ? 'border-green-300' : ''}`}
                              placeholder="••••••••" required={!isLogin} autoComplete="new-password" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-onyx transition-colors">
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            {confirmPassword && confirmPassword === password && (
                              <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" size={14} />
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <motion.button type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 bg-onyx text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-stone-800 active:scale-95 transition-all duration-200 shadow-xl shadow-onyx/15 disabled:opacity-60 disabled:cursor-not-allowed group">
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="mt-8 text-center text-xs text-stone-400 font-light">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button onClick={switchMode} className="text-onyx font-bold hover:text-gold transition-colors underline underline-offset-2">
                    {isLogin ? 'Sign up free' : 'Sign in'}
                  </button>
                </p>

                <div className="mt-10 pt-6 border-t border-stone-100 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-300">© 2024 Tommy Delights Integrated Services</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
