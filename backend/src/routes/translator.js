import express from "express";
import { askGroq } from "../services/groq.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      text,
      fromLanguage,
      toLanguage,
    } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const prompt = `
Translate the following text.

Source Language:
${fromLanguage}

Target Language:
${toLanguage}

Return ONLY the translated text.

Text:
${text}
`;

    const translation = await askGroq(prompt);

    res.json({
      translation,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Translation failed",
    });
  }
});

export default router;