import express from "express";
import { generateWebsiteAI } from "../services/websiteAI.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { html, instruction } = req.body;

    if (!html || !instruction) {
      return res.status(400).json({
        error: "HTML and instruction are required."
      });
    }

    const editedHtml = await generateWebsiteAI(
`
EDIT THE EXISTING WEBSITE.

Current Website HTML:

${html}

User Instruction:

${instruction}

Modify the website according to the instruction.

IMPORTANT:
- Return ONLY the complete updated HTML.
- Start with <!DOCTYPE html>
- End with </html>
- Do not explain anything.
- Do not use Markdown.
- Preserve all existing sections unless the user asks to change them.
`,
{
  maxCompletionTokens: 2000
}
);

res.json({
  success: true,
  html: editedHtml,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Website editing failed."
    });
  }
});

export default router;