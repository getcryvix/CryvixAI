import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { generateCode } from "../lib/api";

export default function AICodeAssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    try {
      setLoading(true);

      const data = await generateCode(prompt);

      setResult(data.result || "No response received.");
    } catch (error) {
      console.error(error);
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 flex items-center justify-center p-10">
        <div className="glass rounded-3xl p-10 max-w-2xl w-full text-center">

          <h1 className="text-4xl font-bold">
            💻 AI Code Assistant
          </h1>

          <p className="mt-4 text-white/70">
            Generate, explain, debug and optimize code with AI.
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what code you want..."
            className="mt-8 w-full h-40 rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-blue-600 py-3 text-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "⏳ Generating..." : "🚀 Generate Code"}
          </button>

          {result && (
            <>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="mt-4 rounded-xl bg-green-600 px-5 py-2 hover:bg-green-700"
              >
                📋 Copy Code
              </button>

              <div className="mt-6 rounded-xl bg-black/30 p-4 text-left whitespace-pre-wrap">
                {result}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}