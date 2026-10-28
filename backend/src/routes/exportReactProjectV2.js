import express from "express";
import archiver from "archiver";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { html } = req.body;

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=cryvixai-react-v2.zip"
    );

    res.setHeader(
      "Content-Type",
      "application/zip"
    );

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.pipe(res);
    // Vite entry
    archive.append(
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CryvixAI Export</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`,
      { name: "index.html" }
    );

    // Main entry
    archive.append(
`import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      { name: "src/main.jsx" }
    );

    archive.append(
`export default function App() {
  return (
    <h1>CryvixAI React Export V2</h1>
  );
}
`,
      { name: "src/App.jsx" }
    );

    archive.append(
`body{
  margin:0;
  font-family:Arial,sans-serif;
}
`,
      { name: "src/index.css" }
    );

    archive.append(
`{
  "name":"cryvixai-react-v2",
  "private":true,
  "version":"1.0.0",
  "type":"module",
  "scripts":{
    "dev":"vite",
    "build":"vite build"
  },
  "dependencies":{
    "react":"^19.1.0",
    "react-dom":"^19.1.0"
  },
  "devDependencies":{
    "vite":"^7.0.0"
  }
}
`,
      { name: "package.json" }
    );

    archive.finalize();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Export failed",
    });
  }
});

export default router;