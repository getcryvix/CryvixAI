import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const cleanOCRText = (text) => {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const runOCR = async (imageBuffer) => {
  return await Tesseract.recognize(
    imageBuffer,
    "eng",
    {
      logger: (info) => {
        if (info.status === "recognizing text") {
          console.log(
            `OCR progress: ${Math.round(
              (info.progress || 0) * 100
            )}%`
          );
        }
      },

      config: {
        tessedit_pageseg_mode: "6",
        preserve_interword_spaces: "1",
      },
    }
  );
};

router.post("/", upload.single("file"), async (req, res) => {
  let filePath = null;

  try {
    // ------------------------------------
    // CHECK FILE
    // ------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image.",
      });
    }

    filePath = req.file.path;

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    const supportedFormats = [
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
    ];

    if (!supportedFormats.includes(extension)) {
      return res.status(400).json({
        success: false,
        error:
          "Please upload a PNG, JPG, JPEG or WEBP image.",
      });
    }

    console.log(
      `OCR started: ${req.file.originalname}`
    );

    // ------------------------------------
    // IMAGE PREPROCESSING
    // ------------------------------------

    console.log("Preparing image for OCR...");

    // Enhanced normal image
    const normalImage = await sharp(filePath)
      .rotate()
      .resize({
        width: 2400,
        withoutEnlargement: false,
        fit: "inside",
      })
      .grayscale()
      .normalize()
      .sharpen({
        sigma: 1.5,
        m1: 1.2,
        m2: 2.0,
      })
      .linear(1.25, -10)
      .png()
      .toBuffer();

    // Inverted image
    // Useful for white text on dark screens
    const invertedImage = await sharp(filePath)
      .rotate()
      .resize({
        width: 2400,
        withoutEnlargement: false,
        fit: "inside",
      })
      .grayscale()
      .normalize()
      .sharpen({
        sigma: 1.5,
        m1: 1.2,
        m2: 2.0,
      })
      .linear(1.25, -10)
      .negate()
      .png()
      .toBuffer();

    console.log(
      "Image preprocessing completed."
    );

    // ------------------------------------
    // OCR - NORMAL IMAGE
    // ------------------------------------

    console.log("Running OCR on normal image...");

    const normalResult = await runOCR(
      normalImage
    );

    const normalText = cleanOCRText(
      normalResult?.data?.text
    );

    const normalConfidence = Math.round(
      Number(
        normalResult?.data?.confidence || 0
      )
    );

    console.log(
      `Normal OCR confidence: ${normalConfidence}%`
    );

    // ------------------------------------
    // OCR - INVERTED IMAGE
    // ------------------------------------

    console.log(
      "Running OCR on inverted image..."
    );

    const invertedResult = await runOCR(
      invertedImage
    );

    const invertedText = cleanOCRText(
      invertedResult?.data?.text
    );

    const invertedConfidence = Math.round(
      Number(
        invertedResult?.data?.confidence || 0
      )
    );

    console.log(
      `Inverted OCR confidence: ${invertedConfidence}%`
    );

    // ------------------------------------
    // SELECT BETTER RESULT
    // ------------------------------------

    let text = normalText;
    let confidence = normalConfidence;
    let selectedMode = "normal";

    if (
      invertedConfidence > normalConfidence &&
      invertedText
    ) {
      text = invertedText;
      confidence = invertedConfidence;
      selectedMode = "inverted";
    }

    console.log(
      `Selected OCR mode: ${selectedMode}`
    );

    console.log(
      `Final OCR confidence: ${confidence}%`
    );

    console.log(
      `OCR text:\n${text || "[NONE]"}`
    );

    // ------------------------------------
    // NO TEXT FOUND
    // ------------------------------------

    if (!text) {
      return res.status(200).json({
        success: true,
        text: "",
        confidence: 0,
        fileName: req.file.originalname,
        message:
          "No readable text detected in this image.",
      });
    }

    // ------------------------------------
    // SUCCESS RESPONSE
    // ------------------------------------

    return res.status(200).json({
      success: true,
      text,
      confidence,
      fileName: req.file.originalname,
    });

  } catch (error) {
    console.error(
      "OCR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to extract text from image.",
    });

  } finally {
    // ------------------------------------
    // DELETE TEMPORARY FILE
    // ------------------------------------

    if (
      filePath &&
      fs.existsSync(filePath)
    ) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error(
          "OCR cleanup error:",
          cleanupError
        );
      }
    }
  }
});

export default router;