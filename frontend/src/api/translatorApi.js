import axios from "axios";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function translateText(
  text,
  fromLanguage,
  toLanguage
) {
  const response = await axios.post(`${API}/api/translator`, {
    text,
    fromLanguage,
    toLanguage,
  });

  return response.data.translation;
}