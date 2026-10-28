import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  generatePresentation,
  downloadPresentation,
} from "../api/presentationApi";
export default function PresentationGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [presentation, setPresentation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    try {
      setLoading(true);

      const result = await generatePresentation(topic);

      setPresentation(result);
    } catch (error) {
      console.error(error);

      alert("Presentation generation failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(presentation);
    alert("Copied Successfully");
  }

  function handleClear() {
    setTopic("");
    setPresentation("");
  }

  async function handleDownload() {
  if (!presentation) {
    alert("Generate a presentation first.");
    return;
  }

  try {
    await downloadPresentation(topic, presentation);
  } catch (error) {
    console.error(error);
    alert("Download failed.");
  }
}
  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-4xl font-bold mb-2">
          AI Presentation Generator
        </h1>

        <p className="text-gray-400 mb-8">
          Generate professional presentation slides using AI.
        </p>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">

          <label className="block mb-3 text-sm font-medium">
            Presentation Topic
          </label>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: Artificial Intelligence"
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-4 outline-none"
          />

          <div className="flex gap-4 mt-6">

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            <button
              onClick={handleCopy}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold"
            >
              Copy
            </button>

            <button
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold"
            >
              Clear
            </button>

          </div>

          <div className="mt-8">
            <label className="block mb-3 text-sm font-medium">
              Generated Presentation
            </label>

            <textarea
              readOnly
              value={presentation}
              placeholder="Your AI generated presentation will appear here..."
              className="w-full h-[500px] rounded-xl bg-zinc-800 border border-zinc-700 p-4 outline-none resize-none"
            />

          </div>

          {presentation && (
            <div className="mt-8 rounded-xl border border-cyan-500 bg-cyan-500/10 p-5">

              <h2 className="text-xl font-bold text-cyan-400 mb-2">
                Presentation Ready 🎉
              </h2>

              <p className="text-gray-300">
                Your presentation has been generated successfully.
              </p>

              <div className="flex gap-4 mt-5">

                <button
                  onClick={handleCopy}
                  className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl"
                >
                  Copy Presentation
                </button>
                

                <button
                  onClick={() => window.print()}
                  className="bg-zinc-700 hover:bg-zinc-600 px-5 py-3 rounded-xl"
                ><button
  onClick={handleDownload}
  className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl"
>
  Download PPT
</button>
                  Print
                </button>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
