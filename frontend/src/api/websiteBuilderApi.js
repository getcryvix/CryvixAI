import axios from "axios";

const API = "http://localhost:3001";

export async function generateWebsite(prompt) {
  const response = await axios.post(
    `${API}/api/website-builder`,
    { prompt }
  );

  console.log("WEBSITE BUILDER API RESPONSE:", response.data);

  const html =
    response.data?.website ||
    response.data?.html ||
    "";

  console.log("FRONTEND HTML LENGTH:", html.length);
  console.log("FRONTEND HTML START:", html.substring(0, 200));

  if (!html.trim()) {
    throw new Error("Backend returned empty website HTML");
  }

  return html;
}

export function downloadWebsite(htmlCode) {
  const blob = new Blob([htmlCode], {
    type: "text/html",
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "cryvixai-website.html";

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}

export function openWebsite(htmlCode) {
  const newWindow = window.open("", "_blank");

  if (!newWindow) return;

  newWindow.document.open();
  newWindow.document.write(htmlCode);
  newWindow.document.close();
}

export async function downloadWebsiteZip(htmlCode) {

  const response = await axios.post(
    `${API}/api/website-builder/download-zip`,
    {
      html: htmlCode,
    },
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(response.data);

  const a = document.createElement("a");

  a.href = url;
  a.download = "cryvixai-website.zip";

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);

}

export async function exportReactProject(htmlCode) {

  const response = await axios.post(
    `${API}/api/website-builder/export-react`,
    {
      html: htmlCode,
    },
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(response.data);

  const a = document.createElement("a");

  a.href = url;
  a.download = "cryvixai-react-project.zip";

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);

}

export async function exportReactProjectV2(htmlCode) {

  const response = await axios.post(
    `${API}/api/website-builder/export-react-v2`,
    {
      html: htmlCode,
    },
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(response.data);

  const a = document.createElement("a");

  a.href = url;
  a.download = "cryvixai-react-v2.zip";

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);

}
export async function editWebsite(html, instruction) {

  const response = await axios.post(
    `${API}/api/website-editor`,
    {
      html,
      instruction,
    }
  );

  return response.data.html;

}
export async function publishWebsite(htmlCode) {

  const response = await axios.post(
    `${API}/api/publish-website`,
    {
      html: htmlCode,
    }
  );

  return response.data;

}