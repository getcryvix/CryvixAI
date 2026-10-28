import express from "express";
import { analyzeImage } from "../services/openrouter.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: "Image is required",
      });
    }

    const result = await analyzeImage(
      imageBase64,
      prompt || "Describe this image in detail."
    );

    res.json({
      result,
    });
  } catch (error) {
    console.error("IMAGE ANALYZER ERROR:");
    console.dir(error.response?.data || error, { depth: null });

    res.status(500).json({
      error: error.message || "Image analysis failed",
    });
  }
});

export default router;