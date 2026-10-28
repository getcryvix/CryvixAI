export function createWebsitePlan(prompt) {
  return `
You are an expert website architect.

Analyze the user's request.

Return a complete plan before generating HTML.

Include:

- Business Type
- Target Audience
- Brand Style
- Color Theme
- Hero Section
- About Section
- Services or Features
- Gallery
- Testimonials
- Pricing (if suitable)
- FAQ (if suitable)
- Contact
- Footer

The design must perfectly match the business.

User Request:

${prompt}
`;
}