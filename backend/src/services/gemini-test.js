import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image",
  contents: "A cinematic portrait of Shah Rukh Khan in a black suit, ultra realistic, 8K.",
  config: {
    responseModalities: ["IMAGE"],
  },
});

for (const part of response.candidates[0].content.parts) {
  if (part.inlineData) {
    fs.writeFileSync(
      "test.png",
      Buffer.from(part.inlineData.data, "base64")
    );
    console.log("✅ Image Saved: test.png");
  }
}