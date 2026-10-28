import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function SummarizerPage() {
  const [text, setText] = useState("");
  const [length, setLength] = useState("medium");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch(
        "http://localhost:3001/api/summarizer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.trim(),
            length,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to generate summary."
        );
      }

      setSummary(data.summary);
    } catch (error) {
      console.error("SUMMARIZER ERROR:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setSummary("");
    setError("");
  };

  const handleCopy = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);
      alert("Summary copied!");
    } catch (error) {
      console.error("COPY ERROR:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-cyan-400">
              AI Summarizer
            </h1>

            <p className="mt-3 text-gray-400">
              Turn long text into a clear and concise summary.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Input */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Your Text
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Paste an article, notes, email or any long text.
                  </p>
                </div>

                <span className="text-xs text-gray-500">
                  {text.length} characters
                </span>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                className="mt-5 w-full h-80 resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-gray-200 outline-none focus:border-cyan-400"
              />

              {/* Summary Length */}
              <div className="mt-5">
                <label className="block mb-2 text-sm text-gray-400">
                  Summary Length
                </label>

                <select
                  value={length}
                  onChange={(e) =>
                    setLength(e.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                >
                  <option value="short">
                    Short
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="detailed">
                    Detailed
                  </option>
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="mt-5 flex gap-3">

                <button
                  onClick={handleSummarize}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Summarizing..."
                    : "Generate Summary"}
                </button>

                <button
                  onClick={handleClear}
                  disabled={loading}
                  className="rounded-xl bg-zinc-800 px-5 py-3 font-semibold text-gray-300 transition hover:bg-zinc-700"
                >
                  Clear
                </button>

              </div>
            </div>

            {/* Result */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Summary
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Your AI-generated summary will appear here.
                  </p>
                </div>

                {summary && (
                  <button
                    onClick={handleCopy}
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-zinc-700"
                  >
                    Copy
                  </button>
                )}
              </div>

              <div className="mt-5 min-h-[420px] rounded-xl border border-zinc-700 bg-zinc-950 p-5">

                {loading ? (
                  <div className="flex h-full min-h-[380px] items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-cyan-400" />

                      <p className="mt-4 text-gray-400">
                        AI is summarizing your text...
                      </p>
                    </div>
                  </div>
                ) : summary ? (
                  <div className="whitespace-pre-wrap leading-7 text-gray-200">
                    {summary}
                  </div>
                ) : (
                  <div className="flex min-h-[380px] items-center justify-center text-center text-gray-500">
                    <div>
                      <p className="text-lg">
                        No summary yet
                      </p>

                      <p className="mt-2 text-sm">
                        Enter your text and click Generate Summary.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}