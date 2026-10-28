const API_URL = "http://localhost:3001";

export async function extractOCR(formData) {
  const response = await fetch(`${API_URL}/api/ocr`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
      data?.message ||
      "OCR request failed"
    );
  }

  return data;
}