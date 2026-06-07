import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Task Categorization using Gemini 3.5 Flash and responseSchema
  app.post("/api/tasks/categorize", async (req, res) => {
    try {
      const { tasks } = req.body;
      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: "Invalid tasks payload" });
      }

      if (tasks.length === 0) {
        return res.json({ categories: [] });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY in the Settings > Secrets panel."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare text block for Gemini model
      const taskListText = tasks.map((t, idx) => {
        return `ID: ${t.id}\nTitle: ${t.title || 'Untitled'}\nDescription: ${t.notes || 'None'}\n---`;
      }).join("\n");

      const systemPrompt = `You are an expert project management assistant. Your task is to categorize each of the provided tasks into one of these three exact tags: 'Development', 'Design', or 'Admin'.
Analyze each task based on its title and description:
- 'Development': Technical tasks, writing script/code, fixing bugs, database setups, configuring APIs, environment deployment, security audits, infrastructure building.
- 'Design': Art, UI/UX mockups, canvas animations, color adjustments, brand identity, layout improvements, styling features, typography rules.
- 'Admin': Corporate management workshops, organizing calendars, client agreements, emails, finance trackers, invoices, status calls, scheduling sessions.

Analyze carefully. You must return a JSON array containing objects with the exact keys: 'id' and 'category'. Do not output any markdown formatting or commentary outside of the JSON payload.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Categorize the following tasks:\n\n${taskListText}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { 
                  type: Type.STRING,
                  description: "The assigned category: 'Development', 'Design', or 'Admin'."
                }
              },
              required: ["id", "category"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response received from Gemini API");
      }

      const categories = JSON.parse(text);
      return res.json({ categories });
    } catch (error: any) {
      console.error("Error in Gemini task categorization:", error);
      return res.status(500).json({ error: error.message || "Failed to categorize tasks" });
    }
  });

  // API Route for live consult chat using Gemini 3.5 Flash with full conversation history
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message content is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY in the Settings > Secrets panel."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Format previous message logs for conversational context support in Gemini chats SDK
      const formattedHistory = (history || []).map((h: any) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      }));

      const systemInstruction = `You are Eng. Sarah (المهندسة سارة), a brilliant, highly professional Lead Systems Architect and Executive Technical Consultant at "Business Developers" (بيزنس ديفلوبرز), a premier Saudi technology advisory & venture builder firm.
Your main role is to consult enterprise clients, answer technical/functional questions, and elegantly guide them in adopting customized sovereign digital solutions of the company.

Key Corporate Details of Business Developers:
1. Core Tech Offerings:
   - Sovereign Enterprise Cloud Systems & automated Terraform IaC migrations.
   - Deep Learning and Custom AI/LLM models serving.
   - Digital Transformation workflows and Open Banking transactional APIs.
   - Ultimate cybersecurity standards (leveraging AES-256 database layers, secure SSL/TLS channels, and Zero-Trust pod networks conforming with Saudi NCA standards).
2. Development SLAs: Average delivery of rich client systems ranges between 3 to 6 months using agile iterative sprints. A fully previewable playground staging is ready in 3-4 weeks.
3. Cost and Appraisal: The company offers flexible cost frameworks. The fastest route is filling out the brief in the "Get Appraisal" / "طلب استشارة" form at the bottom of the page to generate live cost estimate.
4. Strategic Partners: Co-developing with Al-Mutlaq Holding, Al-Ruwwad International, and Al-Moammar sectors.

Interaction Directive:
- Actively maintain a warm, highly polished consult-level hospitality.
- Communicate natively in the language input by the client (default to a beautiful, clean business Arabic unless they speak English).
- Keep responses friendly, professional, clear, and relatively brief (avoid generic overly structured AI text lists).
- You can recommend setting up a virtual Google Meet session or dropping their details in the consultation portal for a live follow-up session.`;

      const chatSession = ai.chats.create({
        model: "gemini-3.5-flash",
        history: formattedHistory,
        config: {
          systemInstruction,
        }
      });

      const response = await chatSession.sendMessage({
        message: message
      });

      return res.json({ response: response.text });
    } catch (error: any) {
      console.error("Error in Gemini live consulting chat:", error);
      return res.status(500).json({ error: error.message || "Failed to generate assistant response" });
    }
  });

  // API Route for Project Summary using Gemini 3.5 Flash
  app.post("/api/project/summary", async (req, res) => {
    try {
      const { tasks, milestones, lang, clientCompanyName, tier } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY in the Settings > Secrets panel."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const isAr = lang === 'ar';

      // Summarize task counts
      const totalTasks = (tasks || []).length;
      const completedTasks = (tasks || []).filter((t: any) => t.status === 'completed' || t.status === 'Done' || t.completed === true).length;
      const pendingTasks = totalTasks - completedTasks;
      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Unpack tasks for Gemini (reducing density to stay well within limits)
      const serializedTasks = (tasks || []).slice(0, 30).map((t: any, idx: number) => {
        const prjStr = t.project ? `[Project: ${t.project}] ` : '';
        return `${idx + 1}. [Status: ${t.status || 'Pending'}] ${prjStr}${t.title || 'Untitled'} (${t.notes || 'No description'})`;
      }).join('\n');

      // Unpack milestones for Gemini
      const serializedMilestones = (milestones || []).slice(0, 15).map((m: any, idx: number) => {
        const prjStr = m.project ? `[Project: ${m.project}] ` : '';
        return `${idx + 1}. [Status: ${m.status || 'Pending'}] ${prjStr}${m.title || m.name || 'Milestone'} (Due/Target: ${m.date || m.dueDate || 'N/A'})`;
      }).join('\n');

      const systemInstruction = isAr 
        ? `أنت مستشار برمجيات ذكي وخبير في إدارة المشاريع لدى شركة "بيزنس ديفلوبرز" (Business Developers).
مهمتك هي مراجعة حالة المشروع الحالية للشريك وصياغة خلاصة فنية تنفيذية باللغة العربية بأسلوب راقٍ وممتاز وموجز.
خاطب الشريك مباشرة وبطريقة مهذبة ومشجعة تليق بمستشار أعمال محترف.

بيانات السياق:
- اسم الشريك: ${clientCompanyName || "الشريك المعتمد"}
- فئة العضوية (Tier): ${tier || "فضّي"}
- نسبة الإنجاز والمهام: تم إنجاز ${completedTasks} مهام من أصل ${totalTasks} (${completionPercentage}%). المهام المتبقية للشركة: ${pendingTasks}.
- مستوى الخدمة (SLA): ميزات الـ SLA حسب العضوية مستوفاة بالكامل.

أعطِ خلاصةً من فقرة أو فقرتين ملهمة تحتوي على:
1. تقييم سريع وحقيقي عن التقدم الكلي لمسار المشروع والتزامه بالجدول الزمني.
2. نصيحة عملية استشارية فنية أو تسليط الضوء على الإنجازات الأخيرة والمهام الحرجة القادمة لضمان قفزة رقمية ريادية.
3. بأسلوب احترافي ومحفز جداً للشريك، تحت توقيع "مكتب إدارة المشاريع - بيزنس ديفلوبرز".`
        : `You are a smart AI Project Management Consultant at "Business Developers".
Your task is to review the partner's current project progress and generate a highly professional, brief executive summary in English.
Address the client partner directly and politely with a reassuring, business-oriented tone.

Context metrics:
- Partner / Client Company: ${clientCompanyName || "Enterprise Client"}
- Service Tier: ${tier || "Silver"}
- Progress: ${completedTasks} completed out of ${totalTasks} tasks (${completionPercentage}% completed). Pending: ${pendingTasks}.

Format your response in 1-2 paragraphs containing:
1. A direct, executive evaluation of the overall project progress and velocity relative to the timeline.
2. Practical advisory insights or highlights of recent completions and upcoming critical path dependencies.
3. An encouraging, professional sign-off as "Project Management Office (PMO) - Business Developers".`;

      const prompt = `Based on these details, generate the summary:
Tasks detail:
${serializedTasks || 'No active tasks listed.'}

Milestones status:
${serializedMilestones || 'No specific milestones listed.'}

Provide ONLY the summary text directly without any additional markdown containers or wrapping unless for styling. Use bold text or bullets inside the text if appropriate to make it highly readable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
        }
      });

      return res.json({ summary: response.text });
    } catch (error: any) {
      console.error("Error generating project summary:", error);
      return res.status(500).json({ error: error.message || "Failed to generate project summary" });
    }
  });

  // Vite development vs production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
