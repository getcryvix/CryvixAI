import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export async function extractPDFText(buffer) {
  const uint8Array = new Uint8Array(buffer);

  const pdf = await getDocument({
    data: uint8Array,
  }).promise;

  let text = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const content = await page.getTextContent();

    text +=
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ") + "\n";
  }

  return text;
}