export function createWebsiteDataPrompt(userPrompt) {
  return `
You are an expert business analyst.

Generate ONLY valid JSON.

Do not generate HTML.
Do not generate Markdown.
Do not explain anything.

Rules:

- Detect the business automatically.
- Create all required fields for that business.
- Add a businessName field.
- Add a heroTitle field.
- Add a heroDescription field.
- Add a heroImage field.
- Add sections if needed.
- Create realistic content.

User Request:

${userPrompt}
`;
}