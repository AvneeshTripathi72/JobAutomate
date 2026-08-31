const OpenAI = require("openai");

const getClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
};

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action, ...payload } = req.body;

  if (!action) {
    return res.status(400).json({ message: "Missing action parameter" });
  }

  try {
    if (action === "score") {
      const { candidateName, jobTitle, jd, resume } = payload;
      if (!candidateName || !jobTitle || !jd || !resume) {
        return res.status(400).json({ message: "Missing required fields for scoring" });
      }

      const prompt = `You are an AI Recruiter. You must score the candidate "${candidateName}" against the Job Description (JD) for the role of "${jobTitle}".
Analyze the candidate's resume text and score them on:
1. Skills (fit for the technologies/skills in the JD)
2. Experience (relevance and depth of background)
3. Culture Fit (inferred from professional tone and profile)
4. Integrity (consistency of details, professional links)

Provide a detailed summary, strengths, matched skills, missing skills, and potential red flags.

You MUST respond with a JSON object. Do not include any markdown styling like \`\`\`json or \`\`\`. Your output must be parseable by JSON.parse.
The JSON object must have exactly the following structure:
{
  "verdict": "strong_fit" | "fit" | "weak_fit" | "not_fit",
  "overallScore": number (between 0 and 100),
  "skillsScore": number (between 0 and 100),
  "experienceScore": number (between 0 and 100),
  "cultureScore": number (between 0 and 100),
  "integrityScore": number (between 0 and 100),
  "summary": "A detailed, professional summary of the candidate's fit.",
  "strengths": ["Strength 1", "Strength 2", ...],
  "matchedSkills": ["Skill 1", "Skill 2", ...],
  "redFlags": ["Red flag 1", "Red flag 2", ...],
  "missingSkills": ["Missing skill 1", "Missing skill 2", ...]
}

Job Description:
${jd}

Candidate Resume:
${resume}`;

      const chatCompletion = await getClient().chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.2,
        response_format: { type: "json_object" }
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "{}";
      const result = JSON.parse(responseText.trim());
      return res.status(200).json(result);

    } else if (action === "generate") {
      const { jobTitle, jd, seniority, numQuestions } = payload;
      if (!jobTitle || !jd || !seniority) {
        return res.status(400).json({ message: "Missing required fields for test generation" });
      }

      const prompt = `You are a Technical Assessment Generator. Based on the job title "${jobTitle}" and the job description, generate ${numQuestions || 5} multiple-choice questions (MCQs) appropriate for a "${seniority}" seniority level.
Each question must test a specific skill mentioned in the job description.
Each question must have exactly 4 choices, and a clear explanation.

You MUST respond with a JSON object. Do not include any markdown styling like \`\`\`json or \`\`\`. Your response must be directly parseable.
The JSON object must have exactly the following structure:
{
  "title": "A descriptive title for this assessment",
  "questions": [
    {
      "q": "The question text?",
      "skill": "Name of the skill being tested (e.g. React)",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0, // 0-based index of the correct option (0, 1, 2, or 3)
      "explanation": "Brief explanation of why this option is correct."
    }
  ]
}

Job Description:
${jd}`;

      const chatCompletion = await getClient().chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "{}";
      const result = JSON.parse(responseText.trim());
      return res.status(200).json(result);

    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

  } catch (err) {
    console.error("Groq AI Error:", err);
    return res.status(500).json({ message: err.message || "Failed to process AI request" });
  }
};
