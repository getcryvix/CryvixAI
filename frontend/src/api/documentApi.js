const API_URL = "http://localhost:3001";

export async function summarizeDocument(formData) {
  const response = await fetch(
    `${API_URL}/api/document-summary`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to summarize document"
    );
  }

  return data.summary;
}