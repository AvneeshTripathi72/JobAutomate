const { createClient } = require("@supabase/supabase-js");

// Use Service Role Key to bypass RLS and perform admin auth operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yeoavqufxojhraycowtu.supabase.co";
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is missing in serverless environment!");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Parse path matching from req.url (e.g. /api/superadmin/companies/123/users or /api/superadmin/companies/123)
  const cleanUrl = req.url.split("?")[0].replace(/\/$/, "");
  const usersMatch = cleanUrl.match(/^\/api\/superadmin\/companies\/([^/]+)\/users$/);
  const idMatch = cleanUrl.match(/^\/api\/superadmin\/companies\/([^/]+)$/);

  try {
    // ─── 1. FETCH USERS OF A COMPANY ──────────────────────────────────────────
    if (req.method === "GET" && usersMatch) {
      const companyId = usersMatch[1];
      
      // List all auth users in the project using Admin Auth API
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;

      // Filter users belonging to this companyId metadata
      const companyUsers = users
        .filter(user => user.user_metadata && user.user_metadata.companyId === companyId)
        .map(user => ({
          id: user.id,
          username: user.email.split("@")[0],
          email: user.email,
          fullName: user.user_metadata.fullName || user.email.split("@")[0],
          role: user.user_metadata.role || "recruiter",
          isActive: !user.banned_until,
          createdAt: user.created_at
        }));

      return res.status(200).json(companyUsers);
    }

    // ─── 2. SUSPEND / ACTIVATE A COMPANY ──────────────────────────────────────
    if (req.method === "PATCH" && idMatch) {
      const id = idMatch[1];
      const { isActive } = req.body;

      const { data, error } = await supabase
        .from("companies")
        .update({ isActive })
        .eq("id", id)
        .select();

      if (error) throw error;
      return res.status(200).json(data[0]);
    }

    // ─── 3. DELETE A COMPANY & ITS USERS ──────────────────────────────────────
    if (req.method === "DELETE" && idMatch) {
      const id = idMatch[1];

      // Fetch users belonging to this company to delete them from Supabase Auth
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (!listError && users) {
        const toDelete = users.filter(user => user.user_metadata && user.user_metadata.companyId === id);
        for (const u of toDelete) {
          await supabase.auth.admin.deleteUser(u.id);
        }
      }

      // Delete company from DB
      const { error: deleteError } = await supabase
        .from("companies")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      return res.status(200).json({ success: true });
    }

    // ─── 4. LIST ALL COMPANIES ────────────────────────────────────────────────
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    // ─── 5. MANUALLY ONBOARD A COMPANY ────────────────────────────────────────
    if (req.method === "POST") {
      const {
        companyName, domain, plan,
        adminUsername, adminPassword, adminEmail, adminFullName
      } = req.body;

      if (!companyName || !adminEmail || !adminPassword || !adminFullName) {
        return res.status(400).json({ message: "Missing required onboarding fields" });
      }

      // a. Insert company into DB
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert([{
          name: companyName,
          domain: domain || null,
          plan: plan || "starter",
          isActive: true
        }])
        .select();

      if (companyError) throw companyError;
      const company = companyData[0];

      // b. Create admin user in Supabase Auth
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          fullName: adminFullName,
          role: "company_admin",
          companyId: company.id
        }
      });

      if (userError) {
        // Rollback company creation if user creation fails
        await supabase.from("companies").delete().eq("id", company.id);
        throw userError;
      }

      return res.status(200).json({ company, user: userData.user });
    }

    return res.status(400).json({ message: "Invalid request route or method" });

  } catch (err) {
    console.error("SuperAdmin companies route error:", err);
    return res.status(500).json({ message: err.message || "Failed to process request" });
  }
};
