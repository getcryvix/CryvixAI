import { supabase } from "./supabase";

const API_URL = "http://localhost:3001";

async function request(endpoint, body) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("Please login again to use CryvixAI.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || errorData.error || "Request failed"
    );
  }

  return await response.json();
}

export function chatWithAI(message, messages = []) {
  return request("/api/chat", {
    message,
    messages,
  });
}

export function generateCode(prompt) {
  return request("/api/ai/code", {
    prompt,
  });
}

export function generateEmail(prompt) {
  return request("/api/chat", {
    message: `Write a professional email for: ${prompt}`,
  });
}

export function generateProposal(prompt) {
  return request("/api/chat", {
    message: `Create a professional business proposal for:

${prompt}

Include:
1. Proposal Title
2. Executive Summary
3. Understanding of Requirements
4. Proposed Solution
5. Scope of Work
6. Timeline
7. Pricing
8. Why Choose Us
9. Terms and Conditions
10. Call to Action

Make it professional, persuasive and client-ready.
Do not invent facts, numbers, companies, achievements, or experience.`,
  });
}

export function generateImage(prompt) {
  return request("/api/image", {
    prompt,
  });
}

export function generateResume(prompt) {
  return request("/api/chat", {
    message: `Create a professional ATS-friendly resume.

STRICT RULES:
- Use only information provided by the candidate.
- Never invent companies, job titles, achievements, percentages, salary, awards, education, or years of experience.
- Do not create fake facts.

Candidate information:
${prompt}`,
  });
}

export function generateCoverLetter(prompt) {
  return request("/api/chat", {
    message: `Write a professional, natural, ATS-friendly ONE-PAGE cover letter.

STRICT RULES:
- Use ONLY the candidate information provided below.
- NEVER invent companies, achievements, percentages, revenue figures, account numbers, awards, clients, job history, or years of experience.
- If a detail is not provided, do not make one up.
- Do not use markdown.
- Do not use ** symbols.
- Do not repeat Subject.
- Do not repeat Dear Hiring Manager.
- Do not repeat Sincerely.
- Do not add a candidate name at the end.
- Use normal words and normal spacing between letters.
- Keep paragraphs concise so the letter fits on one A4 page.

Candidate information:
${prompt}`,
  });
}

export async function chatWithPDF(formData) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("Please login again to use CryvixAI.");
  }

  const response = await fetch(`${API_URL}/api/pdf-chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "PDF request failed"
    );
  }

  return data;
}