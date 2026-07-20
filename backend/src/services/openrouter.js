const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function generateImage(prompt) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/images",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-image-1",
        prompt,
        size: "1024x1024",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    throw new Error(data.error?.message || "Image generation failed");
  }

  return data;
}