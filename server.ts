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
