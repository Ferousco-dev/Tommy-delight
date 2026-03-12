import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, ChefHat, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { authService } from '../lib/authService';
import { getProxiedImageUrl } from '../utils';

interface AuthPageProps {
  onLogin: (user: any) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+234');
  const [email, setEmail] = useState('');

  // IP-based country code detection
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_calling_code) {
          setCountryCode(data.country_calling_code);
        }
      })
      .catch(() => {}); // Fallback to +234
  }, []);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // LOGIN FLOW
        console.log('Attempting login for:', identifier);
        const { data, error: authError } = await authService.signIn(identifier, password);

        if (authError) throw authError;

        if (data.user) {
          console.log('Login successful:', data.user);
          onLogin(data.user);
          
          const userEmail = data.user.email?.toLowerCase() || '';
          const userRole = data.user.user_metadata?.role || data.user.role;
          
          const isStaff = 
            userEmail.endsWith('@tommydelights.com') || 
            userEmail === 'founder@tommydelights.com' ||
            userEmail === 'tommydelight@gmail.com' ||
            userRole === 'admin';
          
          console.log('User role/email check:', { userEmail, userRole, isStaff });
          
          if (isStaff) {
            navigate('/admin', { replace: true });
          } else {
            navigate('/profile', { replace: true });
          }
        }
      } else {
        // REGISTER FLOW
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        console.log('Attempting register for:', email);
        const { data, error: signUpError } = await authService.signUp(email, password, {
          full_name: username,
          username: username,
          phone: `${countryCode}${phone}`,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          console.log('Register successful, logging in directly:', data.user);
          setSuccess(true);
          onLogin(data.user);
          
          // Register leads straight to the website (home)
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = err.message || 'Authentication failed';
      
      if (message.toLowerCase().includes('rate limit')) {
        message = "Too many attempts. Please wait a few minutes before trying again. This is a security measure from our database provider.";
      } else if (message.toLowerCase().includes('invalid login credentials')) {
        message = "Invalid email/username or password. Please check your details and try again.";
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper overflow-hidden relative">
      {/* Background Textures */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />

      {/* Left Side: Branding */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 relative bg-primary overflow-hidden"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <img 
          src="https://picsum.photos/seed/nutrition-care/1200/1600" 
          alt="Tommy Delights" 
          className="absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-[10s] hover:scale-100"
          referrerPolicy="no-referrer"
        />
        
        <div className="relative z-20 flex flex-col justify-end p-20 text-white h-full">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="w-24 h-24 mb-10 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl">
              <ChefHat size={48} className="text-white/90" />
            </div>
            <h1 className="text-7xl md:text-8xl font-display leading-[0.9] mb-8">
              Tommy <br /> <span className="italic font-light text-white/70">Delights</span>
            </h1>
            <p className="text-2xl text-white/80 max-w-md font-serif italic leading-relaxed">
              Quality food processing and professional home & industrial services. Welcome to the family.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 relative z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {success ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-16 bg-white rounded-[3rem] shadow-2xl border border-primary/5"
            >
              <div className="w-24 h-24 bg-primary/5 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <ChefHat size={48} />
              </div>
              <h3 className="text-4xl font-display text-ink mb-4">Welcome Aboard</h3>
              <p className="text-xl text-muted font-serif italic mb-10">Your journey begins now. Preparing your experience...</p>
              <div className="w-full bg-paper h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="bg-primary h-full"
                />
              </div>
            </motion.div>
          ) : (
            <>
              <div className="mb-12 text-center md:text-left">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6"
                >
                  <span className="text-xs font-serif uppercase tracking-[0.2em] text-primary">Secure Access</span>
                </motion.div>
                <h2 className="text-5xl font-display text-ink mb-4">
                  {isLogin ? 'Welcome Back' : 'Join the Family'}
                </h2>
                <p className="text-xl text-muted font-serif italic">
                  {isLogin ? 'Enter your credentials to access your account.' : 'Create an account to join the family.'}
                </p>
              </div>

              {/* Toggle */}
              <div className="flex bg-white p-2 rounded-[2rem] shadow-sm mb-10 border border-primary/5">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-4 rounded-[1.5rem] font-serif text-lg transition-all duration-500 ${isLogin ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-primary'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-4 rounded-[1.5rem] font-serif text-lg transition-all duration-500 ${!isLogin ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-primary'}`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
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

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Username</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Choose a username"
                        className="w-full pl-14 pr-6 py-4 bg-white border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-sm"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Phone Number (WhatsApp)</label>
                    <div className="flex gap-2">
                      <div className="relative group w-32">
                        <select
                          className="w-full pl-4 pr-6 py-4 bg-white border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-sm appearance-none"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                        >
                          <option value="+234">🇳🇬 +234</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+233">🇬🇭 +233</option>
                          <option value="+254">🇰🇪 +254</option>
                          <option value="+27">🇿🇦 +27</option>
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+971">🇦🇪 +971</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted">
                          <ArrowRight size={14} className="rotate-90" />
                        </div>
                      </div>
                      <div className="relative group flex-1">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                          <User size={20} />
                        </div>
                        <input
                          type="tel"
                          required
                          placeholder="7012345678"
                          className="w-full pl-14 pr-6 py-4 bg-white border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-sm"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">
                    {isLogin ? 'Username / Email' : 'Email Address'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                      {isLogin ? <User size={20} /> : <Mail size={20} />}
                    </div>
                    <input
                      type={isLogin ? "text" : "email"}
                      required
                      placeholder={isLogin ? "Username or Email" : "your@email.com"}
                      className="w-full pl-14 pr-6 py-4 bg-white border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-sm"
                      value={isLogin ? identifier : email}
                      onChange={(e) => isLogin ? setIdentifier(e.target.value) : setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="w-full pl-14 pr-14 py-4 bg-white border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-6 flex items-center text-muted hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-xs font-serif uppercase tracking-[0.2em] text-muted ml-2">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                        <Lock size={20} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        className="w-full pl-14 pr-6 py-4 bg-white border border-primary/5 rounded-[1.5rem] outline-none focus:border-primary/20 transition-all text-ink font-serif italic text-lg shadow-sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-primary/10 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                    <span className="text-sm font-serif italic text-muted group-hover:text-primary transition-colors">Remember my sanctuary</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-4 py-5 text-xl disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={24} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-10 text-center text-muted font-serif italic text-lg">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-3 text-primary font-bold hover:underline"
                >
                  {isLogin ? 'Join Now' : 'Sign In'}
                </button>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
