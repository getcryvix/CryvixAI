export function getImagePrompt(prompt) {
  const text = prompt.toLowerCase();

  if (text.includes("hotel") || text.includes("resort")) {
    return "Luxury hotel exterior, 5-star resort, cinematic photography";
  }

  if (text.includes("restaurant") || text.includes("cafe") || text.includes("coffee")) {
    return "Modern restaurant interior, delicious food, premium photography";
  }

  if (text.includes("gym") || text.includes("fitness")) {
    return "Luxury gym, modern fitness equipment, professional lighting";
  }

  if (text.includes("hospital") || text.includes("clinic")) {
    return "Modern hospital interior, healthcare professionals, clean environment";
  }

  if (text.includes("portfolio")) {
    return "Creative workspace, premium office, modern designer setup";
  }

  return "Modern business, premium office, professional photography";
}