import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { askGroq } from "./services/groq.js";
import { generateImage } from "./services/openrouter.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "CryvixAI API",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, messages = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const reply = await askGroq(message, messages);

    res.json({
      reply,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
});

app.post("/api/image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const result = await generateImage(prompt);

    res.json(result);
  } catch (error) {
    console.error("IMAGE ERROR:", error);

    res.status(500).json({
      error: error.message || "Image generation failed",
    });
  }
});

export default app;