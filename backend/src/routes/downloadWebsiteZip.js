import express from "express";
import archiver from "archiver";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({
        error: "HTML is required",
      });
    }

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=cryvixai-website.zip"
    );

    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.pipe(res);

    archive.append(html, {
      name: "index.html",
    });

    archive.finalize();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "ZIP generation failed",
    });

  }
});

export default router;