import express from "express";
import archiver from "archiver";

const router = express.Router();
router.post("/", async (req, res) => {

  try {

    const { html } = req.body;

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=cryvixai-react-project.zip"
    );

    res.setHeader(
      "Content-Type",
      "application/zip"
    );

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.pipe(res);

    archive.append(html, {
      name: "index.html",
    });

    archive.append(
`import React from "react";

export default function App(){

  return(

    <iframe
      src="/index.html"
      title="CryvixAI Website"
      style={{
        width:"100%",
        height:"100vh",
        border:"none"
      }}
    />

  );

}
`,
{
name:"src/App.jsx"
}
);

archive.append(
`import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(
document.getElementById("root")
).render(
<React.StrictMode>
<App/>
</React.StrictMode>
);
`,
{
name:"src/main.jsx"
}
);
archive.append(
`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>CryvixAI React</title>
<script type="module" src="/src/main.jsx"></script>
</head>
<body>
<div id="root"></div>
</body>
</html>`,
{
name:"react-index.html"
}
);

archive.append(
`{
"name":"cryvixai-react-project",
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
}`,
{
name:"package.json"
}
);

archive.finalize();

}catch(error){

console.error(error);

res.status(500).json({
error:"Export failed"
});

}

});

export default router;