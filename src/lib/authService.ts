import { supabase, isSupabaseConfigured } from './supabase';

// Local storage keys
const LOCAL_USER_KEY = 'td_local_user';

export const authService = {
  async signUp(email: string, password: string, metadata: any = {}) {
    console.log('Using backend smart signup for:', email);
    
    // Special case for the requested admin account
    const finalMetadata = {
      ...metadata,
      role: email.toLowerCase() === 'user@gmail.com' ? 'admin' : (metadata.role || 'user')
    };

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, metadata: finalMetadata })
      });

      let data;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Signup response parse error. Text received:', text);
        console.error('Parse error details:', e);
        return { 
          data: { user: null }, 
          error: { message: `Server returned an invalid response (not JSON). Status: ${response.status}` } 
        };
      }
      
      if (!response.ok) {
        const errorMsg = data.message || data.error || (typeof data === 'string' ? data : 'Authentication failed');
        return { data: { user: null }, error: { message: errorMsg } };
      }

      // After successful backend signup/confirm, attempt sign-in to get session
      console.log('Backend signup/confirm successful, signing in...');
      return await this.signIn(email, password);
    } catch (err: any) {
      console.error('Signup fetch error:', err);
      return { data: { user: null }, error: { message: err.message || 'Network error' } };
    }
  },

  async signIn(identifier: string, password: string) {
    if (!isSupabaseConfigured) {
      return { data: { user: null }, error: { message: 'Supabase is not configured. Please check your environment variables.' } };
    }

    let email = identifier;
    console.log('Attempting sign-in for:', identifier);
    
    try {
      // If identifier doesn't look like an email, try to find it as a username
      if (!identifier.includes('@')) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', identifier)
            .maybeSingle();
          
          if (profile?.email && !profileError) {
            email = profile.email;
            console.log('Resolved username to email:', email);
          }
        } catch (e) {
          console.warn('Profile lookup failed, continuing with identifier as email:', e);
        }
      }

      // Attempt sign-in
      const result = await supabase.auth.signInWithPassword({ email, password });

      // If "Email not confirmed" error, try to force confirm via backend and retry
      if (result.error && result.error.message.toLowerCase().includes('email not confirmed')) {
        console.log('Email not confirmed, attempting force-confirm via backend...');
        try {
          const confirmRes = await fetch('/api/auth/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });

          if (confirmRes.ok) {
            console.log('Force-confirm successful, waiting a moment before retrying sign-in...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay
            return await supabase.auth.signInWithPassword({ email, password });
          } else {
            const errorData = await confirmRes.json().catch(() => ({}));
            console.error('Force-confirm failed with status:', confirmRes.status, errorData);
          }
        } catch (err) {
          console.error('Force-confirm fetch failed:', err);
        }
      }

      return result;
    } catch (err: any) {
      console.error('SignIn fatal error:', err);
      return { 
        data: { user: null }, 
        error: { 
          message: err.message === 'Failed to fetch' 
            ? 'Unable to connect to the authentication server. Please check your internet connection or Supabase configuration.' 
            : (err.message || 'An unexpected error occurred during sign in.')
        } 
      };
    }
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async updateUser(attributes: any) {
    return await supabase.auth.updateUser(attributes);
  }
};
