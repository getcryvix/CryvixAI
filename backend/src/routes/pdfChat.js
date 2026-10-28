import express from "express";
import multer from "multer";

import { extractPDFText } from "../services/pdfService.js";
import { askGroq } from "../services/groq.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "PDF file is required",
      });
    }

    const question = req.body.question || "";

    const pdfText = await extractPDFText(req.file.buffer);

    const prompt = `
You are an AI assistant.

Answer ONLY using the PDF content below.

PDF Content:
${pdfText}

Question:
${question}
`;

    const reply = await askGroq(prompt);

    res.json({ reply });

  } catch (error) {
    console.error("PDF CHAT ERROR:", error);

    res.status(500).json({
      error: error.message || "PDF processing failed",
    });
  }
});

export default router;