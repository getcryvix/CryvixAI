import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { summarizeDocument } from "../api/documentApi";

export default function DocumentSummarizerPage() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSummarize() {
    if (!file) {
      alert("Please select a document.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setSummary("");

      const result = await summarizeDocument(formData);

      setSummary(result);
    } catch (error) {
      console.error("DOCUMENT SUMMARIZER ERROR:", error);

      alert(
        error.message || "Summarization failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-surface text-white">

      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-4xl font-bold mb-8">
          AI Document Summarizer
        </h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-4xl">

          {/* FILE UPLOAD */}
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setSummary("");
            }}
            className="block w-full text-sm text-gray-300
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:bg-cyan-600 file:text-white
                       hover:file:bg-cyan-700"
          />

          {/* SELECTED FILE */}
          {file && (
            <div className="mt-4 p-3 rounded-lg bg-zinc-800">
              <p className="text-sm text-gray-300">
                Selected file:
              </p>

              <p className="font-semibold text-white">
                {file.name}
              </p>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleSummarize}
            disabled={loading || !file}
            className="mt-6 bg-cyan-600 px-8 py-3 rounded-xl
                       hover:bg-cyan-700
                       disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            {loading
              ? "Summarizing..."
              : "Summarize Document"}
          </button>

          {/* RESULT */}
          {summary && (
            <div className="mt-8">

              <h2 className="text-2xl font-bold mb-4">
                AI Summary
              </h2>

              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">

                <div className="whitespace-pre-wrap leading-7 text-gray-200">
                  {summary}
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}