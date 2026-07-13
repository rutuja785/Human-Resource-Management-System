import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client to prevent startup crashes when API key is missing
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please set it under Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API: Generate Customized Document with Gemini AI
app.post("/api/generate-document", async (req, res) => {
  try {
    const { templateId, templateTitle, customPrompt, employee, userNotes } = req.body;

    const ai = getGeminiClient();

    let docPrompt = `You are a professional HR specialist. Generate a customized HR document.
Document Type / Template: ${templateTitle || "Custom Document"}

Employee details:
- Name: ${employee?.name || "N/A"}
- Role: ${employee?.role || "N/A"}
- Department: ${employee?.department || "N/A"}
- Join Date: ${employee?.joinDate || "N/A"}
- Birthday: ${employee?.birthDate || "N/A"}
- Salary: ${employee?.salary || "N/A"}
- Additional notes on Employee: ${employee?.notes || "N/A"}

Specific instructions/modifications given by user:
${customPrompt || "No custom prompt provided."}

Additional context:
${userNotes || "No additional context."}

Please output the completed document in beautifully formatted Markdown. Maintain standard, legally compliant formatting. Incorporate ALL the provided employee details seamlessly into the placeholders. Do not include any meta-commentary, introductory remarks, or 'Here is your document' messages — output ONLY the clean, ready-to-use markdown document. Use clear, modern display typography headers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: docPrompt,
      config: {
        temperature: 0.7,
      },
    });

    const markdown = response.text || "";
    res.json({ success: true, markdown });
  } catch (error: any) {
    console.error("Gemini Document Generation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred during document generation.",
    });
  }
});

// API: Generate Birthday Email Template with Gemini AI
app.post("/api/generate-birthday-email", async (req, res) => {
  const { employee, tone } = req.body;
  try {
    const ai = getGeminiClient();

    const prompt = `You are an HR manager drafting a personalized and engaging birthday email.
Employee:
- Name: ${employee?.name}
- Role: ${employee?.role}
- Department: ${employee?.department}
- Additional Notes: ${employee?.notes || "N/A"}

Email Tone: ${tone || "warm and professional"}

Draft a highly professional, engaging, and heartfelt birthday congratulatory email.
Include an attention-grabbing subject line, and a body full of corporate appreciation and celebration.
The output MUST be in JSON format matching this schema:
{
  "subject": "String",
  "body": "String"
}
Do not include any other text besides the JSON block. Do not wrap it in markdown block.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text?.trim() || "{}";
    const data = JSON.parse(jsonText);
    res.json({ success: true, ...data });
  } catch (error: any) {
    console.error("Gemini Birthday Email Error:", error);
    // Provide an elegant fallback if API key is missing or model fails
    const name = employee?.name || "Team Member";
    res.json({
      success: true,
      subject: `Wishing you a wonderful birthday, ${name}! 🎉`,
      body: `Dear ${name},\n\nOn behalf of the entire team, I wanted to take a moment to wish you a very Happy Birthday! 🎂\n\nWe are incredibly grateful for your contributions as our ${employee?.role || "valued team member"} in the ${employee?.department || "department"}. Your dedication, skills, and positive energy make a huge difference every day.\n\nHope you have an amazing day filled with joy, family, and relaxation!\n\nBest regards,\n[Your Name]\nHR Manager`,
      fallback: true,
      error: error.message,
    });
  }
});

// Setup Vite Dev Server / Serve Production Static Files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
