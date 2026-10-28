import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function YouTubeToolkitPage() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    if (!topic.trim()) {
      alert("Please enter a video topic.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3001/api/youtube-toolkit",
        {
          topic,
        }
      );

      setResult(JSON.stringify(response.data.result, null, 2));
    } catch (error) {
      console.error(error);
      alert("Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;

    await navigator.clipboard.writeText(result);
    alert("Result copied successfully!");
  };

  const copyText = async (text) => {
  if (!text) return;

  await navigator.clipboard.writeText(text);
  alert("Copied successfully!");
};

  const clearAll = () => {
    setTopic("");
    setResult("");
  };

  const downloadTxt = () => {
    if (!result) {
      alert("Generate content first.");
      return;
    }

    const blob = new Blob([result], {
      type: "text/plain",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "CryvixAI-YouTube-Toolkit.txt";
    link.click();

    URL.revokeObjectURL(link.href);
  };

  const downloadPdf = () => {
    if (!result) {
      alert("Generate content first.");
      return;
    }

    const pdf = new jsPDF();

    const lines = pdf.splitTextToSize(result, 180);

    pdf.setFontSize(12);
    pdf.text(lines, 10, 10);

    pdf.save("CryvixAI-YouTube-Toolkit.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">
        AI YouTube Toolkit
      </h1>

      <p className="text-gray-400 mb-6">
        Generate YouTube Titles, Descriptions, Hashtags,
        Keywords and Thumbnail Prompts using AI.
      </p>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">

        <label className="block mb-2 font-semibold">
          Video Topic
        </label>

        <textarea
          rows={6}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Example: History of the Roman Empire"
          className="w-full rounded-lg bg-gray-800 border border-gray-700 p-4 outline-none"
        />

        <button
          onClick={generateContent}
          className="mt-5 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>
      </div>
      <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-700">

        <h2 className="text-xl font-bold mb-4">
          AI Result
        </h2>

        <div className="flex flex-wrap gap-3 mb-4">

          <button
            onClick={copyResult}
            className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700"
          >
            📋 Copy
          </button>

          <button
            onClick={clearAll}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700"
          >
            🧹 Clear
          </button>

          <button
            onClick={downloadTxt}
            className="rounded-lg bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-700"
          >
            📄 Download TXT
          </button>

          <button
            onClick={downloadPdf}
            className="rounded-lg bg-orange-600 px-4 py-2 font-semibold hover:bg-orange-700"
          >
            📕 Download PDF
          </button>

        </div>

        {result ? (
  (() => {
    let data;

    try {
      data = JSON.parse(result);
    } catch {
      return (
        <pre className="whitespace-pre-wrap text-gray-300">
          {result}
        </pre>
      );
    }

    return (
      <div className="space-y-6">

        {/* Titles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold">
              🔥 10 Viral YouTube Titles
            </h3>

            <button
              onClick={() => copyText(data.titles?.join("\n"))}
              className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700"
            >
              📋 Copy All
            </button>
          </div>

          <div className="space-y-2">
            {data.titles?.map((title, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg p-3"
              >
                <span className="font-bold min-w-[28px]">
                  {index + 1}.
                </span>

                <span className="flex-1">
                  {title}
                </span>

                <button
                  onClick={() => copyText(title)}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-700"
                >
                  📋 Copy
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
<div>
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-2xl font-bold">
      📝 SEO Description
    </h3>

    <button
      onClick={() => copyText(data.description)}
      className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700"
    >
      📋 Copy
    </button>
  </div>

  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 whitespace-pre-wrap">
    {data.description}
  </div>
</div>

        {/* Hashtags */}
<div>
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-2xl font-bold">
      #️⃣ Viral Hashtags
    </h3>

    <button
      onClick={() => copyText(data.hashtags?.join(" "))}
      className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700"
    >
      📋 Copy All
    </button>
  </div>

  <div className="flex flex-wrap gap-2">
    {data.hashtags?.map((tag, index) => (
      <button
        key={index}
        onClick={() => copyText(tag)}
        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full text-sm"
      >
        {tag}
      </button>
    ))}
  </div>
</div>
        {/* Keywords */}
<div>
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-2xl font-bold">
      🔑 SEO Keywords
    </h3>

    <button
      onClick={() => copyText(data.keywords?.join(", "))}
      className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700"
    >
      📋 Copy All
    </button>
  </div>

  <div className="flex flex-wrap gap-2">
    {data.keywords?.map((keyword, index) => (
      <button
        key={index}
        onClick={() => copyText(keyword)}
        className="bg-gray-800 border border-gray-700 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
      >
        {keyword}
      </button>
    ))}
  </div>
</div>

        {/* Thumbnail */}
<div>
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-2xl font-bold">
      🎨 Thumbnail Prompt
    </h3>

    <button
      onClick={() => copyText(data.thumbnail_prompt)}
      className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700"
    >
      📋 Copy
    </button>
  </div>

  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 whitespace-pre-wrap">
    {data.thumbnail_prompt}
  </div>
</div>

        {/* Upload Time */}
<div>
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-2xl font-bold">
      🇺🇸 Best Upload Time — USA
    </h3>

    <button
      onClick={() => copyText(data.best_upload_time_usa)}
      className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700"
    >
      📋 Copy
    </button>
  </div>

  <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-lg">
    ⏰ {data.best_upload_time_usa}
  </div>
</div>
      </div>
    );
  })()
) : (
  <p className="text-gray-400">
    Your generated YouTube content will appear here.
  </p>
)}
      </div>
    </div>
  );
}