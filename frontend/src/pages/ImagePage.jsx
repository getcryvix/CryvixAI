import { useState, useEffect } from "react";

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [enhancing, setEnhancing] = useState(false);
  const [style, setStyle] = useState("Realistic");
  const [size, setSize] = useState("Square");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [preview, setPreview] = useState("");

  // Reference image
  const [referenceImage, setReferenceImage] = useState("");
  const [referencePreview, setReferencePreview] = useState("");

  // Clear old oversized image history
  useEffect(() => {
    localStorage.removeItem("imageHistory");
  }, []);

  /* =========================================================
     RESIZE REFERENCE IMAGE
     Cloudflare reference images should be <= 512x512
  ========================================================= */

  const resizeReferenceImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const maxSize = 512;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = Math.round(
                (height * maxSize) / width
              );
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round(
                (width * maxSize) / height
              );
              height = maxSize;
            }
          }

          const canvas = document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(
            img,
            0,
            0,
            width,
            height
          );

          const base64 = canvas.toDataURL(
            "image/jpeg",
            0.85
          );

          resolve(base64);
        };

        img.onerror = () => {
          reject(
            new Error("Reference image could not be loaded.")
          );
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
        reject(
          new Error("Reference image could not be read.")
        );
      };

      reader.readAsDataURL(file);
    });
  };


  /* =========================================================
     REFERENCE IMAGE SELECT
  ========================================================= */

  const handleReferenceImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    try {
      const resizedImage =
        await resizeReferenceImage(file);

      setReferenceImage(resizedImage);
      setReferencePreview(resizedImage);

    } catch (error) {
      console.error(
        "Reference image error:",
        error
      );

      alert(
        "Reference image could not be processed."
      );
    }
  };


  /* =========================================================
     REMOVE REFERENCE IMAGE
  ========================================================= */

  const removeReferenceImage = () => {
    setReferenceImage("");
    setReferencePreview("");
  };


  /* =========================================================
     GENERATE IMAGE
  ========================================================= */

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert("Please describe the image you want.");
      return;
    }

    setEnhancing(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    setLoading(true);
    setImage("");

    try {
      const enhancedPrompt = prompt.trim();

      let finalPrompt = `
${style} style,
ultra detailed,
masterpiece,
best quality,
highly realistic.

Create the exact scene described by the user.

Pay close attention to:
- subject identity or appearance
- objects
- actions and pose
- location
- background
- lighting
- camera angle
- composition
- clothing
- colors
- proportions

Do not replace the requested subject with a random person or random object.

User request:
${enhancedPrompt}
`;

      if (referenceImage) {
        finalPrompt += `

REFERENCE IMAGE INSTRUCTIONS:

Use the uploaded reference image as the primary visual reference.

Preserve the important identity and visual characteristics
of the reference subject while following the user's scene,
pose, location, clothing and action instructions.

Do not ignore the reference image.
Do not replace the reference subject with a random person.
`;
      }

      const res = await fetch("/api/image", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: finalPrompt,
          size,
          referenceImage:
            referenceImage || null,
        }),
      });

      const data = await res.json();

      if (data.image) {
        setImage(data.image);

        setImages((prev) =>
          [data.image, ...prev].slice(0, 4)
        );

        setHistory((prev) =>
          [data.image, ...prev].slice(0, 4)
        );
      } else {
        alert(
          data.error ||
            "Image generation failed"
        );
      }

    } catch (error) {
      console.error(
        "Image generation error:",
        error
      );

      alert("Server Error");

    } finally {
      setEnhancing(false);
      setLoading(false);
    }
  };


  /* =========================================================
     DOWNLOAD
  ========================================================= */

  const downloadImage = async () => {
    if (!image) return;

    try {
      const response =
        await fetch(image);

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        `CryvixAI-${Date.now()}.png`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };


  /* =========================================================
     COPY PROMPT
  ========================================================= */

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(
        prompt
      );

      alert("✅ Prompt copied!");

    } catch {
      alert("Copy failed");
    }
  };


  /* =========================================================
     CLEAR HISTORY
  ========================================================= */

  const clearHistory = () => {
    if (
      window.confirm(
        "Delete all image history?"
      )
    ) {
      setHistory([]);
      setImages([]);
      setImage("");

      localStorage.removeItem(
        "imageHistory"
      );
    }
  };


  return (
    <div className="p-8 text-white max-w-5xl mx-auto">

      <h1 className="text-4xl font-bold mb-6">
        🎨 AI Image Generator
      </h1>


      {/* PROMPT */}

      <textarea
        className="w-full p-4 rounded-xl text-black"
        rows={4}
        placeholder="Describe the image you want..."
        value={prompt}
        onChange={(e) =>
          setPrompt(e.target.value)
        }
      />


      {/* REFERENCE IMAGE */}

      <div className="mt-5 p-5 rounded-2xl bg-white/10 border border-white/20">

        <h2 className="text-xl font-semibold mb-3">
          📸 Reference Image
        </h2>

        <p className="text-sm text-gray-300 mb-4">
          Upload a photo when you want CryvixAI
          to use a specific person, object,
          animal or visual reference.
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleReferenceImage}
          className="block w-full text-sm text-white"
        />

        {referencePreview && (
          <div className="mt-4">

            <img
              src={referencePreview}
              alt="Reference"
              className="w-40 h-40 object-cover rounded-xl border border-cyan-400"
            />

            <button
              onClick={removeReferenceImage}
              className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              🗑 Remove Reference
            </button>

          </div>
        )}

      </div>


      {/* STYLE */}

      <select
        className="mt-4 w-full p-3 rounded-xl text-black"
        value={style}
        onChange={(e) =>
          setStyle(e.target.value)
        }
      >
        <option>Realistic</option>
        <option>Anime</option>
        <option>3D Render</option>
        <option>Cartoon</option>
        <option>Cinematic</option>
      </select>


      {/* SIZE */}

      <select
        className="mt-4 w-full p-3 rounded-xl text-black"
        value={size}
        onChange={(e) =>
          setSize(e.target.value)
        }
      >
        <option>Square</option>
        <option>Portrait</option>
        <option>Landscape</option>
      </select>


      {/* GENERATE */}

      <button
        onClick={generateImage}
        disabled={loading}
        className="mt-4 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl disabled:opacity-50"
      >
        {enhancing
          ? "✨ Enhancing Prompt..."
          : loading
          ? "🎨 Generating..."
          : "Generate Image"}
      </button>


      {/* GENERATED IMAGES */}

      {images.length > 0 && (
        <div className="mt-8">

          {images.map(
            (img, index) => (
              <img
                key={index}
                src={img}
                alt="Generated AI Image"
                onClick={() =>
                  setPreview(img)
                }
                className="rounded-xl w-full max-w-xl cursor-pointer mb-4"
              />
            )
          )}

        </div>
      )}


      {/* DOWNLOAD */}

      <button
        onClick={downloadImage}
        disabled={!image}
        className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl disabled:opacity-50"
      >
        ⬇ Download Image
      </button>


      {/* COPY */}

      <button
        onClick={copyPrompt}
        className="mt-3 ml-3 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl"
      >
        📋 Copy Prompt
      </button>


      {/* HISTORY */}

      {history.length > 0 && (
        <div className="mt-10">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-2xl font-bold">
              🖼 Image History
            </h2>

            <button
              onClick={clearHistory}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              🗑 Clear History
            </button>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            {history.map(
              (img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`History ${index}`}
                  onClick={() =>
                    setPreview(img)
                  }
                  className="rounded-xl cursor-pointer"
                />
              )
            )}

          </div>

        </div>
      )}


      {/* FULLSCREEN PREVIEW */}

      {preview && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() =>
            setPreview("")
          }
        >
          <img
            src={preview}
            alt="Preview"
            className="w-screen h-screen object-contain"
          />
        </div>
      )}

    </div>
  );
}