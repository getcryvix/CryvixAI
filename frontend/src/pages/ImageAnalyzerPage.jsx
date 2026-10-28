import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function ImageAnalyzerPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const analyzeImage = async () => {
  if (!image) {
    alert("Please select an image first.");
    return;
  }

  setLoading(true);
  setResult("");

  try {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const imageBase64 = reader.result;

      const response = await axios.post(
        "http://localhost:3001/api/image-analyzer",
        {
          imageBase64,
        }
      );

      setResult(response.data.result);
      setLoading(false);
    };

    reader.readAsDataURL(image);
  } catch (error) {
    console.error(error);
    alert("Image analysis failed.");
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8">
          🖼️ Image Analyzer
        </h1>

        <div className="bg-zinc-900 rounded-2xl p-8">

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="mb-6"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-80 rounded-xl border border-gray-700 mb-6"
            />
          )}

         <button
  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
  onClick={analyzeImage}
  disabled={loading}
>
  {loading ? "Analyzing..." : "Analyze Image"}
</button>

{result && (
  <div className="mt-6 bg-zinc-800 rounded-xl p-4">
    <h2 className="text-xl font-bold mb-2">
      AI Result
    </h2>

    <p className="whitespace-pre-wrap">
      {result}
    </p>
  </div>
)}

        </div>
      </div>
    </div>
  );
}