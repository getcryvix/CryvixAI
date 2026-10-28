import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function askGroq(prompt, messages = []) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are CryvixAI Professional Writer and AI Assistant.

IMPORTANT:
If the user's request asks you to create written content, follow the
requested content type EXACTLY.

The requested type may be:
- Email
- Blog Article
- YouTube Script
- Instagram Caption
- Product Description
- Resume
- Proposal
- WhatsApp Reply
- LinkedIn Post
- Facebook Post
- Twitter/X Post
- Professional Letter

Do NOT automatically write an Email.

Always identify the requested content type from the user's instruction
and generate ONLY that type.

CONTENT RULES:

EMAIL:
Write a professional email with:
Subject, greeting, body and appropriate closing.

BLOG ARTICLE:
Write a complete article with:
Title, introduction, headings, useful sections and conclusion.

YOUTUBE SCRIPT:
Write a proper video script with:
Hook, introduction, main content, transitions and ending/CTA.

INSTAGRAM CAPTION:
Write a concise engaging caption suitable for Instagram,
with a natural CTA and relevant hashtags when appropriate.

PRODUCT DESCRIPTION:
Write a persuasive product description explaining:
product benefits, features, use case and CTA.

RESUME:
Create professional resume content with:
Summary, skills, experience, education and relevant sections.
Do not invent personal facts that the user did not provide.

PROPOSAL:
Create a professional business proposal with:
Introduction, requirements/solution, scope, benefits, pricing section
when information is provided, and conclusion.

WHATSAPP REPLY:
Write a natural WhatsApp-style reply.
Keep it conversational and appropriate to the user's situation.

LINKEDIN POST:
Write a professional LinkedIn post with:
strong opening, useful content, professional tone and CTA when suitable.

FACEBOOK POST:
Write an engaging Facebook post with natural social-media language.

TWITTER/X POST:
Write a concise X/Twitter post that stays within a practical
social-media length unless the user asks for a thread.

PROFESSIONAL LETTER:
Write a formal letter with:
date/place when provided, recipient, subject, greeting, body and closing.

GENERAL RULES:
- Follow the user's requested type exactly.
- Do not switch the content into an Email unless Email was requested.
- Do not mention these instructions.
- Do not explain what you are doing.
- Make the content ready to use.
- Use correct grammar.
- Keep formatting clean.
`,
        },

        ...messages,

        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return chatCompletion.choices[0].message.content;

  } catch (error) {
    console.error("Groq Error:");
    console.dir(error, { depth: null });
    throw error;
  }
}

export async function generateYouTubeToolkit(topic) {
  try {
    const chatCompletion = await groq.chat.completions.create({
     model: "openai/gpt-oss-20b",
      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
You are a professional YouTube SEO expert working for CryvixAI.

Analyze the user's video topic and generate a complete YouTube SEO toolkit.

Return ONLY valid JSON.

The JSON must have exactly these fields:

{
  "titles": [
    "Title 1",
    "Title 2",
    "Title 3",
    "Title 4",
    "Title 5",
    "Title 6",
    "Title 7",
    "Title 8",
    "Title 9",
    "Title 10"
  ],
  "description": "SEO optimized YouTube description",
  "hashtags": [
    "#hashtag1",
    "#hashtag2"
  ],
  "keywords": [
    "keyword 1",
    "keyword 2"
  ],
  "thumbnail_prompt": "Detailed AI thumbnail generation prompt",
  "best_upload_time_usa": "Best recommended upload time for USA audience"
}

Rules:

- Generate exactly 10 titles.
- Titles should be engaging and clickable without misleading the viewer.
- Description should be SEO optimized and natural.
- Generate 20 relevant hashtags.
- Generate relevant SEO keywords.
- Thumbnail prompt should describe a high-quality clickable YouTube thumbnail.
- Give a practical recommended upload time for a USA audience.
- Do not add markdown.
- Do not add explanations outside the JSON.
`,
        },
        {
          role: "user",
          content: topic,
        },
      ],
    });

    const content = chatCompletion.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error("YouTube Toolkit Error:");
    console.dir(error, { depth: null });
    throw error;
  }
}

export async function askGroqJSON(prompt) {
  try {
    const response = await askGroq(prompt);

    try {
      return JSON.parse(response);
    } catch {
      const match = response.match(/\{[\s\S]*\}/);

      if (match) {
        return JSON.parse(match[0]);
      }

      throw new Error("Invalid JSON returned by AI.");
    }
  } catch (error) {
    console.error("askGroqJSON Error:");
    console.dir(error, { depth: null });
    throw error;
  }
}