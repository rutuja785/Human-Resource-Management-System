import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized SMTP Transport client
let smtpTransporter: any = null;

function getSMTPTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT || "587";

  if (!host || !user || !pass) {
    return null;
  }

  if (!smtpTransporter) {
    try {
      smtpTransporter = nodemailer.createTransport({
        host,
        port: parseInt(port, 10),
        secure: port === "465", // true for port 465, false for other ports (using STARTTLS)
        auth: {
          user,
          pass,
        },
      });
    } catch (e) {
      console.error("Failed to initialize SMTP Transporter:", e);
      return null;
    }
  }
  return smtpTransporter;
}

// Lazy-initialized Ethereal SMTP Transport client for free auto-testing out of the box
let etherealTransporter: any = null;

async function getEtherealTransporter() {
  if (!etherealTransporter) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      etherealTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`[Ethereal Auto-SMTP] Provisioned free test account: ${testAccount.user}`);
    } catch (e) {
      console.error("Failed to dynamically provision free Ethereal SMTP test account:", e);
    }
  }
  return etherealTransporter;
}


// Gorgeous responsive HTML Email layout builder
function generateEmailHtml(campaignType: string, employeeName: string, subject: string, body: string): string {
  let headerColor = "#8b5cf6"; // Purple-500
  let bannerText = "HR Studio Operations & Internal Communications";
  let titleText = "HR Notification";
  let accentBlock = "";

  if (campaignType === "Birthday") {
    headerColor = "#ec4899"; // Pink-500
    titleText = "Happy Birthday! 🎂";
    bannerText = "HR Studio Celebrates You";
    accentBlock = `
      <div style="margin-top: 20px; padding: 15px; background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 12px; display: flex; align-items: center;">
        <div style="font-size: 24px; margin-right: 12px;">🎁</div>
        <div>
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #9d174d;">Birthday Perk Activated!</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #be185d;">Enjoy a complimentary Starbucks voucher on HR Studio.</p>
          <span style="display: inline-block; margin-top: 6px; padding: 3px 8px; font-family: monospace; font-size: 11px; font-weight: bold; color: #9d174d; background-color: #fce7f3; border-radius: 4px; text-transform: uppercase;">Code: BDAY-2026-${employeeName.substring(0, 3).toUpperCase()}</span>
        </div>
      </div>
    `;
  } else if (campaignType === "Work Anniversary") {
    headerColor = "#6366f1"; // Indigo-500
    titleText = "Milestone Moment! 🌟";
    bannerText = "HR Studio Career Milestone";
    accentBlock = `
      <div style="margin-top: 20px; padding: 15px; background-color: #e0e7ff; border: 1px solid #c7d2fe; border-radius: 12px; display: flex; align-items: center;">
        <div style="font-size: 24px; margin-right: 12px;">🌟</div>
        <div>
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #3730a3;">An Anniversary Token of Gratitude</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #4338ca;">We appreciate your commitment and loyalty. Your custom performance reward is unlocked in your portal.</p>
        </div>
      </div>
    `;
  } else if (campaignType === "Payslip") {
    headerColor = "#059669"; // Emerald-600
    titleText = "Salary Slip Dispatched 📑";
    bannerText = "HR Studio Secure Payroll";
    accentBlock = `
      <div style="margin-top: 20px; padding: 15px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; font-family: monospace; font-size: 12px;">
        <div style="font-weight: bold; padding-bottom: 6px; border-bottom: 1px dashed #d1fae5; color: #065f46; display: flex; justify-content: space-between;">
          <span>June 2026 Payslip Summary</span>
          <span style="color: #047857; font-size: 10px;">ACH Processed</span>
        </div>
        <div style="margin-top: 8px; display: flex; justify-content: space-between; color: #374151;">
          <span>Basic Salary & Allowances:</span>
          <strong>Fully Dispatched</strong>
        </div>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #065f46; font-style: italic;">Detailed payslip calculations have been successfully credited. Check your HR Studio Portal to view/download PDF.</p>
      </div>
    `;
  } else {
    headerColor = "#475569"; // Slate-600
    titleText = subject || "Team Announcement";
    bannerText = "HR Studio Team Memorandum";
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="500px" style="max-width: 500px; width: 100%; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; border-collapse: separate;" cellspacing="0" cellpadding="0">
                <!-- Header -->
                <tr>
                  <td style="background-color: ${headerColor}; padding: 24px; text-align: center;">
                    <p style="margin: 0; text-transform: uppercase; letter-spacing: 1.5px; font-size: 10px; font-weight: bold; color: rgba(255,255,255,0.85);">${bannerText}</p>
                    <h1 style="margin: 6px 0 0 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">${titleText}</h1>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 24px; text-align: left;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #1e293b;">Dear ${employeeName},</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569; white-space: pre-wrap;">${body}</p>

                    ${accentBlock}

                    <div style="margin-top: 24px; text-align: center;">
                      <a href="${process.env.APP_URL || "https://ai.studio"}" style="display: inline-block; padding: 10px 20px; background-color: ${headerColor}; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        Open Employee Portal
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 16px 24px; text-align: center; font-size: 10px; color: #64748b;">
                    <p style="margin: 0; font-weight: bold; color: #475569;">HR Studio Operations & Internal Communications</p>
                    <p style="margin: 4px 0 0 0;">This is an automated operational email sent on behalf of HR Studio Inc.</p>
                    <p style="margin: 2px 0 0 0;">© 2026 HR Studio Inc. 123 Business Ave, Suite 400, San Francisco, CA.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// Endpoint: Dispatch emails via SMTP if configured, otherwise fallback to Ethereal free testing SMTP
app.post("/api/email/send", async (req, res) => {
  const { campaignType, employeeName, recipientEmail, subject, body } = req.body;

  if (!recipientEmail) {
    return res.status(400).json({ success: false, message: "Recipient email is required" });
  }

  // 1. Try Custom configured SMTP first
  const transporter = getSMTPTransporter();
  if (transporter) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "no-reply@hrstudio.local";
    const fromName = process.env.SMTP_FROM_NAME || "HR Studio";
    
    try {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: recipientEmail,
        subject: subject || `HR Studio Campaign: ${campaignType}`,
        html: generateEmailHtml(campaignType, employeeName || "Employee", subject, body || ""),
      });
      console.log(`[SMTP Email Sent] ID: ${info.messageId}`);
      return res.json({
        success: true,
        mode: "smtp",
        message: "Email dispatched successfully via your configured SMTP server!",
        recipient: recipientEmail
      });
    } catch (err: any) {
      console.error("SMTP Delivery Failed:", err);
      return res.status(500).json({
        success: false,
        mode: "smtp-failed",
        message: `SMTP Delivery Failed: ${err.message}. Please double-check your SMTP host, port, credentials, or secure configuration in your secrets panel.`,
        recipient: recipientEmail
      });
    }
  }

  // 2. Fall back to programmatically provisioned Ethereal free SMTP test account (100% free, zero config!)
  try {
    const freeTransporter = await getEtherealTransporter();
    if (freeTransporter) {
      const info = await freeTransporter.sendMail({
        from: '"HR Studio Auto-SMTP" <no-reply@hrstudio.local>',
        to: recipientEmail,
        subject: subject || `HR Studio Campaign: ${campaignType}`,
        html: generateEmailHtml(campaignType, employeeName || "Employee", subject, body || ""),
      });
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[Ethereal SMTP Sent] ID: ${info.messageId}, Preview: ${previewUrl}`);
      
      return res.json({
        success: true,
        mode: "ethereal",
        message: "Email dispatched successfully via free auto-provisioned Ethereal SMTP!",
        recipient: recipientEmail,
        previewUrl: previewUrl || undefined
      });
    }
  } catch (err: any) {
    console.error("Ethereal SMTP Dispatch Failed:", err);
  }

  // 3. Last resort local simulator fallback
  console.log(`[Email Campaign Simulated] Type: ${campaignType} sent to ${recipientEmail}`);
  res.json({
    success: true,
    mode: "simulated",
    message: "Campaign simulated and logged successfully! Setup SMTP credentials in your Secrets panel (SMTP_HOST, SMTP_USER, SMTP_PASS) to enable instant server-side delivery, or use the client-side 'Mailto' option to send for free with one click.",
    recipient: recipientEmail
  });
});

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;


function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.warn("GEMINI_API_KEY is not configured. Running AI features in high-quality simulation mode.");
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (e) {
      console.error("Failed to initialize Gemini Client:", e);
      return null;
    }
  }
  return aiClient;
}

// AI Endpoint: Draft Communications
app.post("/api/ai/draft", async (req, res) => {
  const { type, employeeName, role, department, extraDetails } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Return high-quality fallback simulation when API key is missing
    const simulatedSubject = `HR Studio Automatic Draft: ${type} for ${employeeName || "Team Member"}`;
    let simulatedBody = "";
    if (type === "Offer Letter") {
      simulatedBody = `Dear ${employeeName || "[Candidate Name]"},\n\nWe are absolutely delighted to offer you the position of ${role || "[Role]"} in our ${department || "[Department]"} department at HR Studio. We were incredibly impressed by your interviews, skills, and values.\n\nKey Terms of the Offer:\n- Position: ${role || "[Role]"}\n- Department: ${department || "[Department]"}\n- Annual Salary: ${extraDetails || "$95,000"}\n- Start Date: Immediately\n\n(Simulated draft. To enable real-time Gemini generation, please configure your GEMINI_API_KEY in the Secrets panel)`;
    } else if (type === "LOR") {
      simulatedBody = `To Whom It May Concern,\n\nI am writing to express my highest recommendation for ${employeeName || "[Employee]"}. In their capacity as ${role || "[Role]"} in the ${department || "[Department]"} division, they demonstrated outstanding execution, technical superiority, and an excellent collaborative mindset.\n\nThey consistently delivered enterprise-grade work, and I have no doubt they will be an invaluable asset to any team they join.\n\nSincerely,\nHR Director, HR Studio\n\n(Simulated draft. Please configure GEMINI_API_KEY in Secrets)`;
    } else {
      simulatedBody = `Dear ${employeeName || "[Employee Name]"},\n\nThis is a custom communications draft prepared for your reference regarding ${type}.\n\nContext details: ${extraDetails || "Company updates and policy reference."}\n\nWarm regards,\nHR Studio Operations\n\n(Simulated draft. Please configure GEMINI_API_KEY in Secrets)`;
    }
    return res.json({ subject: simulatedSubject, body: simulatedBody, isSimulated: true });
  }

  try {
    const prompt = `Write a professional HR ${type} for employee/candidate named ${employeeName || "John Doe"}.
    Their role is ${role || "Software Engineer"} in the ${department || "Engineering"} department.
    Additional details provided: ${extraDetails || "None"}.
    Provide a JSON object containing:
    - "subject": A fitting, polished email subject line or document title.
    - "body": The complete, professionally crafted, and detailed document/email content. Ensure the tone is elite, modern, and respectful. Use standard placeholders if necessary.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING, description: "Professional subject line or document title" },
            body: { type: Type.STRING, description: "Polished and detailed letter/document body content" }
          },
          required: ["subject", "body"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Gemini draft API error:", err);
    res.status(500).json({ error: "Gemini execution failed", details: err.message });
  }
});

// AI Endpoint: Evaluate Candidate Resumes
app.post("/api/ai/evaluate", async (req, res) => {
  const { jobTitle, resumeText } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // High-quality resume evaluation simulation
    const simulatedScore = resumeText?.toLowerCase().includes("kubernetes") || resumeText?.toLowerCase().includes("figma") ? 88 : 65;
    const simulatedEval = `Candidate shows decent relevance for ${jobTitle || "the position"}.
    Key Strengths: Found keywords in resume text. Relevant industry exposure seems present.
    Areas of concern: Requires deep verification of actual project contributions.
    
    (Simulated Evaluation. Configure GEMINI_API_KEY in Settings to enable real-time Gemini parsing and scoring)`;
    return res.json({ score: simulatedScore, evaluation: simulatedEval, isSimulated: true });
  }

  try {
    const prompt = `Evaluate the following Candidate Resume against the target job opening of: "${jobTitle || "Senior Developer"}".
    Resume Content:
    """
    ${resumeText || ""}
    """
    
    Provide your expert analysis as an HR AI assistant. Provide a JSON response containing:
    - "score": A match score integer between 0 and 100 based on core skills, experience, and certifications relative to ${jobTitle}.
    - "evaluation": A concise, highly insightful, and constructive evaluation paragraph explaining your match score and recommending key interview questions or follow-up focus areas.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Integer evaluation score from 0 to 100" },
            evaluation: { type: Type.STRING, description: "A concise professional bulleted/paragraphed critique of suitability" }
          },
          required: ["score", "evaluation"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Gemini evaluate API error:", err);
    res.status(500).json({ error: "Gemini evaluation failed", details: err.message });
  }
});

// AI Endpoint: HR Chat Assistant (trained on policy guidelines)
app.post("/api/ai/chat", async (req, res) => {
  const { message, history } = req.body;
  const client = getGeminiClient();

  if (!client) {
    let simulatedResponse = `Welcome to the HR Studio Assistant! I am trained on your company handbook guidelines.
    
    Here is some quick handbook information:
    - Leave Policy: Full-time employees receive 18 days of paid annual leave plus sick leave.
    - Attendance: Core work hours are 9:00 AM to 5:00 PM local time. Flexible arrival is permitted.
    - Performance: Appraisals are conducted bi-annually (H1 in June, H2 in December).
    - Payroll: Salaries are credited on the last business day of each month.
    
    (Note: This is a simulated assistance response. Configure your GEMINI_API_KEY in Settings to enable live conversation with Gemini!)`;
    return res.json({ response: simulatedResponse, isSimulated: true });
  }

  try {
    const systemInstruction = `You are HR Studio's premium SaaS HR Assistant, a knowledgeable, friendly, and expert colleague trained on the HR Studio Employee Handbook.
    HR Studio Guidelines:
    1. Paid Leaves: 18 annual paid leaves, 10 casual leaves, maternity is 12 weeks paid.
    2. Working Hours: Flexible, core window is 10 AM to 4 PM. Total target is 40 hours/week.
    3. Asset Policy: Laptops must be returned upon exit. Company covers up to $200 for remote office setups.
    4. Payroll: Invoices/payslips are processed on the 28th of each month.
    5. Expenses: Meal expensing capped at $30/day during business travels.
    
    Respond in a professional, concise, and helpful tone. Do not mention that you have an instruction sheet; speak as an integrated system assistant.`;

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Add current user message
    formattedHistory.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ response: response.text });
  } catch (err: any) {
    console.error("Gemini assistant API error:", err);
    res.status(500).json({ response: "I encountered a minor issue processing that. Please try again. " + err.message });
  }
});

// Vite Development Middleware integration and server start
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`HR Studio Server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error("Failed to start server:", err);
});

