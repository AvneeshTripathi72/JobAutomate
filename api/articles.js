const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yeoavqufxojhraycowtu.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const fallbackArticles = [
  {
    id: "fb-1",
    title: "How to Ace Your Technical Interview: Tips from Recruiter Panel",
    category: "Interview Tips",
    excerpt: "Technical interviews can be daunting. Learn the exact strategies, coding practice routines, and behavioral answers that top recruiters look for.",
    content: "A technical interview is more than just coding. It's about problem-solving, communication, and showing your engineering practices. First, always clarify the question. Don't start coding immediately. Second, walk through your brute-force approach first, then optimize. Third, write clean, modular code with descriptive variable names. Finally, test your edge cases and walk through dry runs.",
    author: "Tilcons Team",
    readTime: "5 min read",
    published: true,
    publishedDate: "2026-08-27T10:00:00Z"
  },
  {
    id: "fb-2",
    title: "5 Common Resume Mistakes You Need to Avoid",
    category: "Career Advice",
    excerpt: "Your resume is your first impression. Make sure it stands out for the right reasons by avoiding these classic layout and content mistakes.",
    content: "Many qualified candidates get rejected because of poor resume structure. 1. Unclear bullet points: Use the X-Y-Z formula (Accomplished [X] as measured by [Y], by doing [Z]). 2. Typos and formatting issues: Ensure margins and fonts are consistent. 3. Too generic: Tailor your resume keywords to the job description. 4. Wall of text: Use bullet points instead of paragraphs. 5. Irrelevant information: Focus on recent experience.",
    author: "Senior Recruiter",
    readTime: "4 min read",
    published: true,
    publishedDate: "2026-08-27T10:00:00Z"
  },
  {
    id: "fb-3",
    title: "Mastering the Art of Remote Collaboration",
    category: "Workplace Success",
    excerpt: "With remote work here to stay, building strong virtual communication and boundary management habits is critical for your career growth.",
    content: "Remote collaboration requires intentionality. Over-communication is key—keep your team updated on your progress via Slack or Teams. Manage your time effectively by setting clear boundaries between work and personal life. Use video calls for complex topics to build stronger relationships with colleagues. Document your processes so team members can work asynchronously without blockers.",
    author: "Tilcons Recruiter",
    readTime: "3 min read",
    published: true,
    publishedDate: "2026-08-27T10:00:00Z"
  },
  {
    id: "fb-4",
    title: "How to Negotiate Your Salary: A Recruiter's Perspective",
    category: "Career Advice",
    excerpt: "Salary negotiations don't have to be stressful. Learn how to research market rates and articulate your value during the offer stage.",
    content: "Negotiating your salary is a normal part of the hiring process. Start by researching market rates for your role and location using tools like Glassdoor or LinkedIn Salary. Never give a number first if possible—ask for the budget range instead. When presenting your counter-offer, focus on the value you bring to the company, citing specific achievements from your previous roles.",
    author: "Lead Recruiter",
    readTime: "6 min read",
    published: true,
    publishedDate: "2026-08-27T10:00:00Z"
  },
  {
    id: "fb-5",
    title: "Transitioning to a Tech Manager Role: What to Expect",
    category: "Leadership",
    excerpt: "Moving from individual contributor to engineering manager is a major career pivot. Here is how to navigate the transition successfully.",
    content: "Transitioning to a management role means shifting your focus from writing code to helping others write code. Your success is now measured by your team's output, not just your own. Focus on building trust through regular 1-on-1s. Learn to delegate task assignments instead of taking on all critical tasks yourself. Develop your soft skills, as communication and conflict resolution will become daily tasks.",
    author: "Hiring Manager",
    readTime: "5 min read",
    published: true,
    publishedDate: "2026-08-27T10:00:00Z"
  }
];

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("published_date", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Supabase query failed or returned no data, returning fallback articles");
      return res.status(200).json(fallbackArticles);
    }

    const mapped = data.map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      excerpt: row.excerpt,
      content: row.content,
      author: row.author,
      readTime: row.read_time,
      published: row.published,
      publishedDate: row.published_date
    }));

    return res.status(200).json(mapped);
  } catch (err) {
    console.error("Error in get articles route, returning fallbacks:", err);
    return res.status(200).json(fallbackArticles);
  }
};
