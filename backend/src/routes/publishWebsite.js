import express from "express";
import axios from "axios";
import FormData from "form-data";
import archiver from "archiver";
import { PassThrough } from "stream";

const router = express.Router();

const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN;

const headers = {
  Authorization: `Bearer ${NETLIFY_TOKEN}`,
};

router.post("/", async (req, res) => {
  console.log("🚀 Publish route hit");
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({
        success: false,
        error: "Website HTML is required.",
      });
    }

    console.log("1. Request received");
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    const stream = new PassThrough();
    const chunks = [];

    stream.on("data", (chunk) => chunks.push(chunk));

    archive.pipe(stream);

    archive.append(html, {
      name: "index.html",
    });
    console.log("3. HTML added");

    await archive.finalize();
    console.log("4. Archive finalized");

    await new Promise((resolve, reject) => {

  stream.on("finish", resolve);

  stream.on("end", resolve);

  stream.on("close", resolve);

  stream.on("error", reject);

});
    console.log("5. ZIP ready");

    const zipBuffer = Buffer.concat(chunks);
    console.log("6. Creating Netlify site");
    const siteResponse = await axios.post(
  "https://api.netlify.com/api/v1/sites",
  {},
  {
    headers,
  }
);

const site = siteResponse.data;
console.log("7. Site created");
const deployResponse = await axios.post(
  `https://api.netlify.com/api/v1/sites/${site.id}/deploys`,
  zipBuffer,
  {
    headers: {
      ...headers,
      "Content-Type": "application/zip",
    },
    maxBodyLength: Infinity,
  }
);

const deploy = deployResponse.data;
console.log("8. Deploy completed");

console.log("Deploy Created:", deploy.id);

console.log("Netlify Site Created:");
console.log(site.id);
console.log(site.url);

    console.log("ZIP Created:", zipBuffer.length, "bytes");
res.json({
  success: true,
  message: "Website published successfully!",
  siteId: site.id,
  deployId: deploy.id,
  url: deploy.ssl_url || deploy.deploy_ssl_url || site.ssl_url || site.url,
});

  } catch (error) {

  console.error("========== ERROR ==========");

  console.error(error.response?.data);

  console.error(error.message);

  console.error("===========================");

  res.status(500).json({
    success: false,
    error: error.response?.data || error.message,
  });

}

});

export default router;