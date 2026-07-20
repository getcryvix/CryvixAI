import { useState } from "react";

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImage("");

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.image) {
        setImage(data.image);
      } else {
        alert(data.error || "Image generation failed");
      }
    } catch (err) {
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">🎨 AI Image Generator</h1>

      <input
        className="w-full p-4 rounded-xl text-black"
        placeholder="Enter image prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={generateImage}
        className="mt-4 bg-cyan-500 px-6 py-3 rounded-xl"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {image && (
        <img
          src={image}
          alt="Generated"
          className="mt-8 rounded-xl w-full max-w-xl"
        />
      )}
    </div>
  );
}