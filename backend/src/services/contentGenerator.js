export function createContentPrompt(userPrompt) {
  return `
You are an expert business copywriter.

Create realistic content for this website.

Business:
${userPrompt}

Rules:

- Never use Lorem Ipsum.
- Never use dummy text.
- Write natural English.
- Create catchy headings.
- Create professional sub-headings.
- Create realistic paragraphs.
- Create strong call-to-action text.
- Create feature names.
- Create testimonial names.
- Create pricing titles if needed.
- Create FAQ questions if needed.

The content must match the business type perfectly.
`;
}