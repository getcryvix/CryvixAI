import { useState } from "react";

export default function WebsitePreview({ code }) {
  const [device, setDevice] = useState("desktop");

  const widths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px",
  };

  // AI-generated HTML को 그대로 preview में दिखाओ
  const previewCode = code || `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Preview</title>
</head>
<body>
  <h1>Generate a website to preview it.</h1>
</body>
</html>
`;

  return (
    <div className="mt-8 rounded-xl border border-zinc-700 overflow-hidden">

      <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-700 flex items-center justify-between">

        <h3 className="font-semibold text-white">
          Live Preview
        </h3>

        <div className="flex gap-2 relative z-10">

          <button
            onClick={() => setDevice("desktop")}
            className="px-3 py-1 rounded bg-cyan-600 text-white text-sm"
          >
            💻 Desktop
          </button>

          <button
            onClick={() => setDevice("tablet")}
            className="px-3 py-1 rounded bg-orange-500 text-white text-sm"
          >
            📱 Tablet
          </button>

          <button
            onClick={() => setDevice("mobile")}
            className="px-3 py-1 rounded bg-pink-600 text-white text-sm"
          >
            📲 Mobile
          </button>

        </div>

      </div>

      <div className="bg-zinc-800 p-5 flex justify-center relative z-0">

        <iframe
          title="Website Preview"
          srcDoc={previewCode}
          style={{
            width: widths[device],
            height: "800px",
            transition: "0.3s",
            border: "none",
            borderRadius: "12px",
            background: "#fff",
          }}
        />

      </div>

    </div>
  );
}