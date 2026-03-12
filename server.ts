import express from "express";
import "express-async-errors";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

// Initialize Supabase Client for Backend
const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl ? (rawSupabaseUrl.startsWith('http') ? rawSupabaseUrl : `https://${rawSupabaseUrl}`) : '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("CRITICAL: Supabase credentials missing on backend. API routes will fail.");
}

const supabase = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Global request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// AUTH MIDDLEWARE
const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No valid authorization header" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Staff check logic (matches frontend)
  const isStaff = 
    user.email?.endsWith('@tommydelights.com') || 
    user.email === 'founder@tommydelights.com' || 
    user.email === 'tommydelight@gmail.com' ||
    user.user_metadata?.role === 'admin';

  if (!isStaff) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  (req as any).user = user;
  next();
};

// API ROUTES
const api = express.Router();

api.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    type: "supabase", 
    time: new Date().toISOString(), 
    env: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL,
    supabaseConfigured: !!supabase
  });
});

api.get("/products", async (req, res) => {
  try {
    if (!supabase) return res.json([]);
    const { data, error } = await supabase.from("products").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err: any) {
    console.error('Products fetch error:', err);
    res.status(500).json({ error: "Failed to fetch products", message: err.message });
  }
});

api.post("/products", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { name, price, category } = req.body;
  if (!name || price === undefined || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }
  if (!['food', 'service'].includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }
  const { data, error } = await supabase!.from("products").insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.put("/products/:id", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.params;
  const { data, error } = await supabase.from("products").update(req.body).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.delete("/products/:id", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.params;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

api.get("/testimonials", async (req, res) => {
  try {
    if (!supabase) return res.json([]);
    const { data, error } = await supabase.from("testimonials").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err: any) {
    console.error('Testimonials fetch error:', err);
    res.status(500).json({ error: "Failed to fetch testimonials", message: err.message });
  }
});

api.post("/testimonials", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const { data, error } = await supabase.from("testimonials").insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.put("/testimonials/:id", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.params;
  const { data, error } = await supabase.from("testimonials").update(req.body).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.delete("/testimonials/:id", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.params;
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// SERVICES API
api.get("/services", async (req, res) => {
  try {
    if (!supabase) return res.json([]);
    const { data, error } = await supabase.from("services").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err: any) {
    console.error('Services fetch error:', err);
    res.status(500).json({ error: "Failed to fetch services", message: err.message });
  }
});

api.post("/services", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { data, error } = await supabase.from("services").insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.put("/services/:id", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.params;
  const { data, error } = await supabase.from("services").update(req.body).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.delete("/services/:id", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.params;
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// SITE CONTENT API
api.get("/content", async (req, res) => {
  try {
    if (!supabase) return res.json({});
    const [categories, founder, homepage] = await Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("founder").select("*").eq("id", 1).maybeSingle(),
      supabase.from("homepage").select("*").eq("id", 1).maybeSingle()
    ]);
    res.json({
      categories: categories.data || [],
      founder: founder.data || null,
      homepage: homepage.data || null
    });
  } catch (err: any) {
    console.error('Content fetch error:', err);
    res.status(500).json({ error: "Failed to fetch content", message: err.message });
  }
});

api.post("/content/categories", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { data, error } = await supabase.from("categories").insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.put("/content/categories/:id", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.params;
  const { data, error } = await supabase.from("categories").update(req.body).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.delete("/content/categories/:id", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.params;
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

api.put("/content/founder", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { data, error } = await supabase.from("founder").upsert({ id: 1, ...req.body }).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.put("/content/homepage", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { data, error } = await supabase.from("homepage").upsert({ id: 1, ...req.body }).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// LEADS API
api.get("/leads", requireAdmin, async (req, res) => {
  try {
    if (!supabase) return res.json([]);
    const { data, error } = await supabase.from("leads").select("*").order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err: any) {
    console.error('Leads fetch error:', err);
    res.status(500).json({ error: "Failed to fetch leads", message: err.message });
  }
});

api.post("/leads", async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const { data, error } = await supabase.from("leads").insert([{
    name,
    email,
    subject,
    message,
    created_at: new Date().toISOString()
  }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// ORDERS API
api.get("/orders", async (req, res) => {
  try {
    if (!supabase) return res.json([]);
    const { data, error } = await supabase.from("orders").select("*").order('order_date', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err: any) {
    console.error('Orders fetch error:', err);
    res.status(500).json({ error: "Failed to fetch orders", message: err.message });
  }
});

api.post("/orders", async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { data, error } = await supabase.from("orders").insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.put("/orders/:id", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.params;
  const { data, error } = await supabase.from("orders").update(req.body).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

api.delete("/orders/:id", requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.params;
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Auth API - Using admin client to bypass email confirmation for better DX
api.post("/auth/signup", async (req, res) => {
  if (!supabase) {
    console.error("[AUTH] Supabase client not initialized. Check environment variables.");
    return res.status(500).json({ error: "Authentication server not configured. Please set SUPABASE_SERVICE_ROLE_KEY." });
  }
  
  const { email, password, metadata } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  
  console.log(`[AUTH] Smart Signup/Confirm request for: ${email}`);
  
  try {
    // 1. Try to create the user with auto-confirmation
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata || {}
    });

    if (error) {
      // 2. If user already exists, try to find and ensure they are confirmed
      const errMsg = error.message.toLowerCase();
      if (errMsg.includes('already registered') || errMsg.includes('already exists')) {
        console.log(`[AUTH] User ${email} already exists, ensuring they are confirmed...`);
        
        // Find user by email in profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        let userId = profile?.id;

        if (!userId) {
          // Fallback to listUsers if profile not found
          console.log(`[AUTH] Profile not found for ${email}, checking auth.users...`);
          const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
          const foundUser = (users as any[]).find(u => u.email?.toLowerCase() === email.toLowerCase());
          userId = foundUser?.id;
        }

        if (userId) {
          const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
            email_confirm: true
          });
          
          if (updateError) {
            console.error(`[AUTH] Failed to force confirm existing user ${email}:`, updateError);
          } else {
            console.log(`[AUTH] Existing user ${email} force-confirmed successfully`);
          }
          return res.json({ message: "User confirmed", user: { id: userId, email } });
        }
      }
      
      console.error(`[AUTH] Signup error for ${email}:`, error);
      return res.status(400).json({ error: error.message });
    }
    
    console.log(`[AUTH] Signup successful (auto-confirmed) for: ${data.user?.id}`);
    res.json(data);
  } catch (err: any) {
    console.error(`[AUTH] Signup crash for ${email}:`, err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

// Force confirm an existing user
api.post("/auth/confirm", async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { email } = req.body;
  
  console.log(`[AUTH] Attempting force-confirm for: ${email}`);
  
  try {
    // 1. Try profiles table first
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    let userId = profile?.id;

    // 2. Fallback to listUsers if not in profiles
    if (!userId) {
      console.log(`[AUTH] User ${email} not in profiles, checking auth.users...`);
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      const user = (users as any[]).find(u => u.email?.toLowerCase() === email.toLowerCase());
      userId = user?.id;
    }
    
    if (!userId) {
      console.warn(`[AUTH] User ${email} not found anywhere for confirmation`);
      return res.status(404).json({ error: "User not found" });
    }
    
    // Update user to be confirmed
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true
    });
    
    if (updateError) throw updateError;
    
    console.log(`[AUTH] Force-confirm successful for: ${userId}`);
    res.json({ success: true, message: "User confirmed" });
  } catch (err: any) {
    console.error(`[AUTH] Confirm crash for ${email}:`, err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

// Mount API router
app.use("/api", api);

// Catch-all for unmatched API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
});

// Global Error Handler - Ensures we always return JSON for API errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('SERVER ERROR:', err);
  
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (req.path.startsWith('/api')) {
    return res.status(status).json({ 
      error: true,
      status,
      message,
      path: req.path
    });
  }
  
  next(err);
});

async function startServer() {
  const PORT = 3000;

  // VITE MIDDLEWARE (MOUNTED AFTER API)
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn('Vite could not be loaded, skipping middleware:', e);
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.all("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;


