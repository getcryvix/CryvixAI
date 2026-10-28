import { askGroq } from "./groq.js";
import { createWebsiteDataPrompt } from "./websiteDataGenerator.js";

export async function createBusinessData(prompt) {

  const aiPrompt = createWebsiteDataPrompt(prompt);

  const response = await askGroq(aiPrompt);

  try {
    return JSON.parse(response);
  } catch (err) {
    console.log("JSON Parse Error");
    return {};
  }

}