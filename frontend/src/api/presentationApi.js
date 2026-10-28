import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

export async function generatePresentation(topic) {
  const response = await axios.post(
    `${API}/api/presentation`,
    { topic }
  );

  return response.data.presentation;
}

export async function downloadPresentation(
  topic,
  presentation
) {
  const response = await axios.post(
    `${API}/api/presentation/download`,
    {
      topic,
      presentation,
    },
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = url;

  link.download = `${topic || "Presentation"}.pptx`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}