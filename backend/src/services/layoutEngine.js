export function getLayout(prompt) {
  const text = prompt.toLowerCase();

  if (text.includes("apple")) {
    return "Apple Style";
  }

  if (text.includes("tesla")) {
    return "Tesla Style";
  }

  if (text.includes("glass")) {
    return "Glassmorphism";
  }

  if (text.includes("minimal")) {
    return "Minimal";
  }

  if (text.includes("luxury")) {
    return "Luxury";
  }

  if (text.includes("modern")) {
    return "Modern";
  }

  return "Modern";
}