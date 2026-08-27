const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yeoavqufxojhraycowtu.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("inquiry_type", "Demo Request")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    // Handle case where created_at column doesn't exist by falling back
    if (error) {
      const { data: dataFallback, error: errorFallback } = await supabase
        .from("contacts")
        .select("*")
        .eq("inquiry_type", "Demo Request")
        .eq("status", "pending");
      
      if (errorFallback) throw errorFallback;
      
      return res.status(200).json(dataFallback || []);
    }

    return res.status(200).json(data || []);
  } catch (err) {
    console.error("Pending requests route error:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch pending requests" });
  }
};
