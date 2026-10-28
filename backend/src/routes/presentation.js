import express from "express";
import { askGroq } from "../services/groq.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: "Topic is required",
      });
    }

    const prompt = `
You are a professional presentation creator.

Create a beautiful presentation.

Topic:
${topic}

Rules:

Return clean markdown.

Format:

# Presentation Title

## Slide 1
Title:
Content:

## Slide 2
Title:
Content:

Continue until Slide 10.

Finally add:

## Conclusion
`;

    const presentation = await askGroq(prompt);

    res.json({
      success: true,
      presentation,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Presentation generation failed",
    });
  }
});

export default router;