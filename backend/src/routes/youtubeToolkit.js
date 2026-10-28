import express from "express";
import { generateYouTubeToolkit } from "../services/groq.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: "Topic is required",
      });
    }

    const result = await generateYouTubeToolkit(topic);

    res.json({
      result,
    });
  } catch (error) {
    console.error("YOUTUBE TOOLKIT ERROR:");
    console.dir(error, { depth: null });

    res.status(500).json({
      error: error.message || "YouTube Toolkit failed",
    });
  }
});

export default router;