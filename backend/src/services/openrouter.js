import axios from "axios";
import sharp from "sharp";
console.log("CRYVIXAI IMAGE API LOADED");


/* =========================================================
   AI IMAGE GENERATOR - CLOUDFLARE FLUX.2 DEV
   Supports:
   - Normal text-to-image
   - Reference image
   - Square / Portrait / Landscape
========================================================= */

export async function generateImage(
  prompt,
  size,
  referenceImage = null
) {
  try {
    const form = new FormData();

    /* -----------------------------------------
       PROMPT
    ----------------------------------------- */

    form.append("prompt", prompt);


    /* -----------------------------------------
       IMAGE SIZE
    ----------------------------------------- */

    let width = 1024;
    let height = 1024;

    if (size === "Portrait") {
      width = 768;
      height = 1024;
    }

    if (size === "Landscape") {
      width = 1024;
      height = 768;
    }

    form.append("width", String(width));
    form.append("height", String(height));


    /* -----------------------------------------
       QUALITY
    ----------------------------------------- */

    form.append("steps", "20");


    /* -----------------------------------------
       REFERENCE IMAGE
    ----------------------------------------- */

    if (referenceImage) {
      try {
        const match = referenceImage.match(
          /^data:(.+);base64,(.+)$/
        );

        if (!match) {
          throw new Error("Invalid reference image format.");
        }

        const contentType = match[1];
        const base64Data = match[2];

        const binaryData = Buffer.from(
  base64Data,
  "base64"
);

/* RESIZE REFERENCE IMAGE FOR CLOUDFLARE */
const resizedData = await sharp(binaryData)
  .resize({
    width: 510,
    height: 510,
    fit: "inside",
    withoutEnlargement: true
  })
  .jpeg({ quality: 90 })
  .toBuffer();

const blob = new Blob(
  [resizedData],
  { type: "image/jpeg" }
);
        form.append(
          "input_image_0",
          blob,
          "reference.png"
        );

        console.log(
          "REFERENCE IMAGE ATTACHED TO GENERATION"
        );

      } catch (referenceError) {
        console.error(
          "REFERENCE IMAGE ERROR:",
          referenceError.message
        );

        throw new Error(
          "Reference image could not be processed."
        );
      }
    }


    /* -----------------------------------------
       CLOUDFLARE API
    ----------------------------------------- */

    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-2-dev`,
      form,
      {
       headers: {
  Authorization:
    `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
},
        timeout: 180000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );


    /* -----------------------------------------
       RESPONSE
    ----------------------------------------- */

    const imageData =
      response.data?.result?.image;

    if (!imageData) {
      console.error(
        "CLOUDFLARE IMAGE RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );

      throw new Error(
        "Image data was not returned by Cloudflare."
      );
    }


    return {
      image:
        `data:image/jpeg;base64,${imageData}`
    };

  } catch (error) {

    console.error(
      "CLOUDFLARE FLUX.2 IMAGE GENERATION ERROR!"
    );

    console.dir(
  error.response?.data || {
    message: error.message
  },
  { depth: null }
);

    throw error;
  }
}



/* =========================================================
   IMAGE ANALYZER - OPENROUTER
========================================================= */

export async function analyzeImage(
  imageBase64,
  prompt = "Describe this image in detail."
) {
  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",

      {
        model:
          "qwen/qwen2.5-vl-72b-instruct",

        messages: [
          {
            role: "user",

            content: [
              {
                type: "text",
                text: prompt
              },

              {
                type: "image_url",

                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ]
      },

      {
        headers: {
          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
            "application/json"
        }
      }
    );

    return response.data
      .choices[0]
      .message
      .content;

  } catch (error) {

    console.error(
      "IMAGE ANALYZER ERROR:"
    );

    console.dir(
      error.response?.data || error,
      { depth: null }
    );

    throw error;
  }
}

/* =========================================================
   REFERENCE IMAGE GENERATOR - OPENROUTER
   SAME PERSON / REFERENCE IMAGE
========================================================= */

export async function generateReferenceImage(
  prompt,
  referenceImage
) {
  try {
    if (!referenceImage) {
      throw new Error("Reference image is required.");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/images",
      {
        model: "google/gemini-nano-banana-2.1",
        prompt: prompt,
        input_references: [
  {
    type: "image_url",
    image_url: {
      url: referenceImage
    }
  }
]
      },
      {
        headers: {
          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
            "application/json"
        },

        timeout: 180000
      }
    );

    const imageData =
      response.data?.data?.[0]?.b64_json;

    if (!imageData) {
      console.error(
        "OPENROUTER IMAGE RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );

      throw new Error(
        "OpenRouter did not return image data."
      );
    }

    return {
      image:
        `data:image/png;base64,${imageData}`
    };

  } catch (error) {

    console.error(
      "OPENROUTER REFERENCE IMAGE ERROR:"
    );

    console.dir(
      error.response?.data || {
        message: error.message
      },
      { depth: null }
    );

    throw error;
  }
}