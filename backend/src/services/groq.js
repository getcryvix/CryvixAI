import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function askGroq(prompt) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
  {
    role: "system",
    content: "You are CryvixAI, a professional AI assistant. Give accurate, helpful, and well-structured answers. Use bullet points when useful and be polite."
  },
  {
    role: "user",
    content: prompt,
  },
],
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
}