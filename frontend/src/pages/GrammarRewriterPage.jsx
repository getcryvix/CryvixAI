import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { rewriteGrammar } from "../lib/api";

export default function GrammarRewriterPage() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("grammar");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const data = await rewriteGrammar(text.trim(), mode);

      if (!data.success || !data.result) {
        throw new Error(data.error || "Unable to process text.");
      }

      setResult(data.result);
    } catch (error) {
      console.error("GRAMMAR REWRITER ERROR:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult("");
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      alert("Text copied!");
    } catch (error) {
      console.error("COPY ERROR:", error);
      alert("Unable to copy text.");
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-cyan-400">
              Grammar & Rewriter
            </h1>
            <p className="mt-3 text-gray-400">
              Fix grammar, rewrite and improve your text with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold">Your Text</h2>
              <p className="mt-2 text-sm text-gray-400">
                Enter an email, message, paragraph or any text.
              </p>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="mt-5 min-h-[280px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-white placeholder-gray-600 outline-none focus:border-cyan-400"
              />

              <div className="mt-5">
                <label className="mb-2 block text-sm text-gray-400">
                  Choose Action
                </label>

                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                >
                  <option value="grammar">Fix Grammar</option>
                  <option value="professional">Professional</option>
                  <option value="simple">Simple English</option>
                  <option value="shorter">Make Shorter</option>
                  <option value="detailed">Make Detailed</option>
                </select>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleRewrite}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-cyan-500 px-5 py-3 font-semibold transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Improve Text"}
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

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Improved Text</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Your improved text will appear here.
                  </p>
                </div>

                {result && (
                  <button
                    onClick={handleCopy}
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-zinc-700"
                  >
                    Copy
                  </button>
                )}
              </div>

              <div className="mt-5 min-h-[420px] rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                {loading ? (
                  <div className="flex min-h-[380px] items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-cyan-400" />
                      <p className="mt-4 text-gray-400">
                        AI is improving your text...
                      </p>
                    </div>
                  </div>
                ) : result ? (
                  <p className="whitespace-pre-wrap leading-7 text-gray-200">
                    {result}
                  </p>
                ) : (
                  <div className="flex min-h-[380px] items-center justify-center text-center text-gray-500">
                    <div>
                      <p className="text-lg">No result yet</p>
                      <p className="mt-2 text-sm">
                        Enter your text and click Improve Text.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {result && (
                <button
                  onClick={handleCopy}
                  className="mt-5 w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold transition hover:bg-cyan-400"
                >
                  Copy Text
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}