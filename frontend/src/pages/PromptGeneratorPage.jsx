import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function PromptGeneratorPage() {
  const [request, setRequest] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!request.trim()) {
      alert("Please describe what you need a prompt for.");
      return;
    }

    try {
      setLoading(true);
      setPrompt("");

      const response = await fetch(
        "http://localhost:3001/api/prompt-generator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request: request.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Prompt generation failed"
        );
      }

      setPrompt(data.prompt);
    } catch (error) {
      console.error("PROMPT GENERATOR ERROR:", error);

      alert(
        error.message ||
          "Unable to generate prompt."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setRequest("");
    setPrompt("");
  };

  const handleCopy = async () => {
    if (!prompt) return;

    try {
      await navigator.clipboard.writeText(prompt);
      alert("Prompt copied!");
    } catch (error) {
      console.error("COPY ERROR:", error);
      alert("Unable to copy prompt.");
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-cyan-400">
              Prompt Generator
            </h1>

            <p className="mt-3 text-gray-400">
              Create powerful AI prompts for any task.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* INPUT CARD */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <h2 className="text-xl font-semibold">
                What do you need?
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Describe your task in simple words. CryvixAI
                will turn it into a detailed AI prompt.
              </p>

              <textarea
                value={request}
                onChange={(e) =>
                  setRequest(e.target.value)
                }
                placeholder="Example: Create a YouTube video script about AI tools for beginners..."
                className="mt-5 w-full min-h-[250px] rounded-xl bg-zinc-950 border border-zinc-800 p-4 text-white placeholder-gray-600 outline-none focus:border-cyan-400 resize-none"
              />

              <div className="flex gap-3 mt-5">

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
                >
                  {loading
                    ? "Generating..."
                    : "Generate Prompt"}
                </button>

                <button
                  onClick={handleClear}
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 font-semibold transition"
                >
                  Clear
                </button>

              </div>
            </div>

            {/* OUTPUT CARD */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Generated Prompt
                </h2>

                {prompt && (
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold transition"
                  >
                    Copy
                  </button>
                )}
              </div>

              <div className="mt-5 min-h-[310px] rounded-xl bg-zinc-950 border border-zinc-800 p-5">

                {loading ? (
                  <div className="flex items-center justify-center min-h-[270px]">
                    <p className="text-cyan-400">
                      Creating your prompt...
                    </p>
                  </div>
                ) : prompt ? (
                  <p className="text-gray-200 whitespace-pre-wrap leading-7">
                    {prompt}
                  </p>
                ) : (
                  <div className="flex items-center justify-center min-h-[270px]">
                    <p className="text-gray-500 text-center">
                      Your generated prompt will appear here.
                    </p>
                  </div>
                )}

              </div>

              {prompt && (
                <button
                  onClick={handleCopy}
                  className="w-full mt-5 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold transition"
                >
                  Copy Prompt
                </button>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}