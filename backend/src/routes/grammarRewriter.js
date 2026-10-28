import express from "express";
import { askGroq } from "../services/groq.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      text,
      mode = "grammar",
    } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Text is required",
      });
    }

    let instruction = "";

    if (mode === "grammar") {
      instruction = `
Fix grammar, spelling, punctuation and sentence structure.
Keep the original meaning and wording as much as possible.
`;
    } else if (mode === "professional") {
      instruction = `
Rewrite the text in a professional, polished and clear tone.
Keep the original meaning.
`;
    } else if (mode === "simple") {
      instruction = `
Rewrite the text using simple, easy-to-understand language.
Keep the original meaning.
`;
    } else if (mode === "shorter") {
      instruction = `
Make the text shorter and more concise while keeping the important information.
`;
    } else if (mode === "detailed") {
      instruction = `
Rewrite and expand the text with useful detail while keeping the original meaning.
Do not invent facts.
`;
    } else {
      instruction = `
Improve the grammar, clarity and readability of the text.
Keep the original meaning.
`;
    }

    const aiPrompt = `
You are an expert English grammar and rewriting assistant.

${instruction}

Rules:
- Do not change the original meaning.
- Do not invent facts.
- Do not explain what you changed.
- Do not add unnecessary commentary.
- Return ONLY the improved text.

Text:
${text.trim()}
`;

    const result = await askGroq(aiPrompt);

    const output = String(result || "").trim();

    if (!output) {
      return res.status(500).json({
        success: false,
        error: "AI returned an empty response",
      });
    }

    return res.json({
      success: true,
      result: output,
    });
  } catch (error) {
    console.error(
      "GRAMMAR REWRITER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Grammar and rewriting failed",
    });
  }
});

export default router;