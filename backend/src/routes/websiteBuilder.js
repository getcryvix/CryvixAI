import express from "express";
import { generateWebsite } from "../services/websiteEngine.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    console.log("=================================");
    console.log("WEBSITE BUILDER REQUEST");
    console.log("PROMPT:", prompt);
    console.log("=================================");

    const result = await generateWebsite(prompt);

    console.log("WEBSITE ENGINE RESULT TYPE:", typeof result);

    console.log(
      "WEBSITE ENGINE RESULT KEYS:",
      result && typeof result === "object"
        ? Object.keys(result)
        : "NOT AN OBJECT"
    );

    const websiteHtml =
      typeof result === "string"
        ? result
        : result?.html || result?.website || "";

    console.log("FINAL WEBSITE HTML LENGTH:", websiteHtml.length);
    console.log("FINAL IMG TAG COUNT:", (websiteHtml.match(/<img\b/gi) || []).length);
console.log("FINAL BACKGROUND IMAGE COUNT:", (websiteHtml.match(/background-image\s*:/gi) || []).length);

    console.log(
      "FINAL WEBSITE HTML START:",
      websiteHtml.substring(0, 200)
    );

    if (!websiteHtml.trim()) {
      console.error("ERROR: WEBSITE HTML IS EMPTY");

      return res.status(500).json({
        success: false,
        error: "Website HTML was empty",
      });
    }

    console.log("WEBSITE HTML READY");

    return res.json({
      success: true,
      website: websiteHtml,
      html: websiteHtml,
      template: result?.template || "none",
      theme: result?.theme || null,
      layout: result?.layout || null,
    });

  } catch (error) {
    console.error("=================================");
    console.error("WEBSITE BUILDER ERROR");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      error: "Website generation failed",
      message: error?.message || "Unknown error",
    });
  }
});

export default router;