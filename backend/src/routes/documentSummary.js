import express from "express";
import multer from "multer";
import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { askGroq } from "../services/groq.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a document.",
      });
    }

    const fileName = req.file.originalname;
    const extension = path.extname(fileName).toLowerCase();

    let text = "";

    // -----------------------------------------
    // TXT
    // -----------------------------------------
    if (extension === ".txt") {
      text = req.file.buffer.toString("utf-8");
    }

    // -----------------------------------------
    // PDF
    // -----------------------------------------
    else if (extension === ".pdf") {
      const parser = new PDFParse({
  data: req.file.buffer,
});

const pdfData = await parser.getText();

text = pdfData.text;

await parser.destroy();
    }

    // -----------------------------------------
    // DOCX
    // -----------------------------------------
    else if (extension === ".docx") {
      const result = await mammoth.extractRawText({
        buffer: req.file.buffer,
      });

      text = result.value;
    }

    // -----------------------------------------
    // Unsupported
    // -----------------------------------------
    else {
      return res.status(400).json({
        success: false,
        error: "Supported formats are PDF, DOCX and TXT.",
      });
    }

    text = text.trim();

    if (!text) {
      return res.status(400).json({
        success: false,
        error: "No readable text was found in this document.",
      });
    }

    // -----------------------------------------
    // AI SUMMARY
    // -----------------------------------------

    const prompt = `
You are a professional AI document summarization assistant.

Summarize the document below accurately.

Rules:

1. Use ONLY information present in the document.
2. Do NOT invent facts.
3. Do NOT add information from outside the document.
4. Keep the original meaning.
5. Remove unnecessary repetition.
6. Keep important facts, numbers, names and key points.
7. Make the summary easy to read.
8. Use headings or bullet points when useful.
9. Do not say "Here is the summary".
10. Return ONLY the final summary.

DOCUMENT:

${text}
`;

    const summary = await askGroq(prompt);

    if (!summary) {
      return res.status(500).json({
        success: false,
        error: "AI returned an empty summary.",
      });
    }

    return res.json({
      success: true,
      summary: summary.trim(),
      fileName,
    });

  } catch (error) {
    console.error("DOCUMENT SUMMARY ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to summarize document.",
    });
  }
});

export default router;