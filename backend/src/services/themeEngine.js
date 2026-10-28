export function getTheme(prompt) {
  const text = prompt.toLowerCase();

  if (text.includes("hotel") || text.includes("resort")) {
    return {
      primary: "#d4af37",
      secondary: "#08111f",
      accent: "#ffffff"
    };
  }

  if (text.includes("restaurant") || text.includes("cafe") || text.includes("coffee")) {
    return {
      primary: "#8B4513",
      secondary: "#FFF8E7",
      accent: "#3E2723"
    };
  }

  if (text.includes("gym") || text.includes("fitness")) {
    return {
      primary: "#ff3b3b",
      secondary: "#101010",
      accent: "#ffffff"
    };
  }

  if (text.includes("hospital") || text.includes("clinic")) {
    return {
      primary: "#1976D2",
      secondary: "#ffffff",
      accent: "#0D47A1"
    };
  }

  return {
    primary: "#2563eb",
    secondary: "#ffffff",
    accent: "#111827"
  };
}