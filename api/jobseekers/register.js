const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yeoavqufxojhraycowtu.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, fullName, phone, currentPosition, experienceLevel } = req.body;

  try {
    let authUser;
    
    // Attempt to bypass email verification if we have the service role key
    if (serviceRoleKey) {
      const adminSupabase = createClient(supabaseUrl, serviceRoleKey);
      const { data, error } = await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          fullName,
          phone,
          currentPosition,
          experienceLevel,
          role: "jobseeker",
        },
      });
      
      if (error) throw error;
      authUser = data.user;
      
      // Now login to get the session token to return to the client
      const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (loginError) throw loginError;
      return res.status(200).json(sessionData);
      
    } else {
      // Fallback if no service key is provided
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
            phone,
            currentPosition,
            experienceLevel,
            role: "jobseeker",
          },
        },
      });

      if (error) {
        throw error;
      }
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: error.message || "Failed to register" });
  }
};
