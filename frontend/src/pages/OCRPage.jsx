import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { extractOCR } from "../api/ocrApi";

const API_URL = "http://localhost:3001";

export default function OCRPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeAction, setActiveAction] = useState("");

  const handleOCR = async () => {
    if (!file) {
      alert("Please select an image.");
      return;
    }

    try {
      setLoading(true);
      setResult("");
      setAiResult("");
      setActiveAction("");

      const formData = new FormData();
      formData.append("file", file);

      const data = await extractOCR(formData);

      setResult(data.text || "");
    } catch (error) {
      console.error("OCR ERROR:", error);
      alert(error.message || "OCR failed.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // AI ACTION
  // ------------------------------------

  const runAIAction = async (action) => {
    if (!result) return;

    try {
      setAiLoading(true);
      setActiveAction(action);
      setAiResult("");

      const prompts = {
        summary: `
Summarize the following OCR text clearly.
Keep all important information.
Use simple language.

OCR TEXT:
${result}
`,

        clean: `
Clean and correct the following OCR text.
Fix obvious OCR mistakes, spelling, spacing and formatting.
Do not invent information.
Return only the cleaned text.

OCR TEXT:
${result}
`,

        hindi: `
Translate the following text into clear Hindi.
Preserve names, numbers, phone numbers, addresses and important details accurately.

TEXT:
${result}
`,

        details: `
Extract the important information from this OCR text.

Create a structured list containing:
- Name / Company
- Job / Position
- Salary
- Location
- Experience
- Qualification
- Contact Number
- Interview Time
- Other Important Information

Only include information that is actually present.
Do not invent missing information.

OCR TEXT:
${result}
`,

        email: `
Create a professional job application email using the following OCR text.
Keep it concise and professional.
Do not invent company details that are not present.

OCR TEXT:
${result}
`,

        whatsapp: `
Create a short and professional WhatsApp message for contacting the person/company mentioned in this OCR text about the opportunity.

OCR TEXT:
${result}
`,
      };

      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompts[action],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "AI request failed."
        );
      }

      const text =
        data.reply ||
        data.message ||
        data.text ||
        "";

      setAiResult(text);
    } catch (error) {
      console.error("AI OCR ACTION ERROR:", error);
      alert(error.message || "AI processing failed.");
    } finally {
      setAiLoading(false);
    }
  };

  // ------------------------------------
  // COPY
  // ------------------------------------

  const copyText = async (text) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      alert("Text copied successfully!");
    } catch (error) {
      console.error(error);
      alert("Copy failed.");
    }
  };

  // ------------------------------------
  // DOWNLOAD
  // ------------------------------------

  const downloadText = (text, filename) => {
    if (!text) return;

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ------------------------------------
  // CLEAR
  // ------------------------------------

  const clearAll = () => {
    setFile(null);
    setResult("");
    setAiResult("");
    setActiveAction("");
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">

      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-4xl font-bold mb-2">
          AI OCR
        </h1>

        <p className="text-gray-400 mb-8">
          Extract text from images and turn it into useful AI-powered content.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-5xl">

          {/* -------------------------------- */}
          {/* UPLOAD */}
          {/* -------------------------------- */}

          <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center">

            <input
              id="ocr-file"
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setResult("");
                setAiResult("");
                setActiveAction("");
              }}
              className="hidden"
            />

            <label
              htmlFor="ocr-file"
              className="inline-block cursor-pointer bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl font-semibold"
            >
              Choose Image
            </label>

            {file && (
              <div className="mt-4">

                <p className="text-gray-400">
                  Selected file:
                </p>

                <p className="font-semibold text-white mt-1">
                  {file.name}
                </p>

              </div>
            )}

          </div>

          {/* -------------------------------- */}
          {/* OCR BUTTON */}
          {/* -------------------------------- */}

          <button
            onClick={handleOCR}
            disabled={loading || !file}
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Extracting Text..."
              : "Extract Text"}
          </button>

          {/* -------------------------------- */}
          {/* OCR RESULT */}
          {/* -------------------------------- */}

          {result && (
            <div className="mt-8">

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-2xl font-bold">
                  Extracted Text
                </h2>

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      copyText(result)
                    }
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() =>
                      downloadText(
                        result,
                        "OCR_Extracted_Text.txt"
                      )
                    }
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                  >
                    Download TXT
                  </button>

                </div>

              </div>

              <textarea
                value={result}
                onChange={(e) =>
                  setResult(e.target.value)
                }
                className="w-full h-80 bg-zinc-800 border border-zinc-700 rounded-xl p-5 text-gray-200 leading-7 resize-y"
                placeholder="Extracted text will appear here..."
              />

              {/* -------------------------------- */}
              {/* AI ACTIONS */}
              {/* -------------------------------- */}

              <div className="mt-8">

                <h2 className="text-xl font-bold mb-4">
                  ✨ AI Actions
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                  <button
                    onClick={() =>
                      runAIAction("summary")
                    }
                    disabled={aiLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
                  >
                    ✨ AI Summary
                  </button>

                  <button
                    onClick={() =>
                      runAIAction("clean")
                    }
                    disabled={aiLoading}
                    className="bg-slate-600 hover:bg-slate-700 px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
                  >
                    🧹 Clean Text
                  </button>

                  <button
                    onClick={() =>
                      runAIAction("hindi")
                    }
                    disabled={aiLoading}
                    className="bg-orange-600 hover:bg-orange-700 px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
                  >
                    🇮🇳 Hindi
                  </button>

                  <button
                    onClick={() =>
                      runAIAction("details")
                    }
                    disabled={aiLoading}
                    className="bg-teal-600 hover:bg-teal-700 px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
                  >
                    📋 Extract Details
                  </button>

                  <button
                    onClick={() =>
                      runAIAction("email")
                    }
                    disabled={aiLoading}
                    className="bg-pink-600 hover:bg-pink-700 px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
                  >
                    📧 Create Email
                  </button>

                  <button
                    onClick={() =>
                      runAIAction("whatsapp")
                    }
                    disabled={aiLoading}
                    className="bg-green-700 hover:bg-green-800 px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
                  >
                    💬 WhatsApp Reply
                  </button>

                </div>

              </div>

              {/* -------------------------------- */}
              {/* AI RESULT */}
              {/* -------------------------------- */}

              {aiLoading && (
                <div className="mt-8 bg-zinc-800 border border-zinc-700 rounded-xl p-5">
                  <p className="text-cyan-400">
                    ✨ AI is processing your text...
                  </p>
                </div>
              )}

              {aiResult && !aiLoading && (
                <div className="mt-8">

                  <div className="flex items-center justify-between mb-4">

                    <h2 className="text-2xl font-bold">
                      AI Result
                    </h2>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          copyText(aiResult)
                        }
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                      >
                        Copy
                      </button>

                      <button
                        onClick={() =>
                          downloadText(
                            aiResult,
                            "CryvixAI_Result.txt"
                          )
                        }
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                      >
                        Download
                      </button>

                    </div>

                  </div>

                  <textarea
                    value={aiResult}
                    onChange={(e) =>
                      setAiResult(e.target.value)
                    }
                    className="w-full h-80 bg-zinc-800 border border-zinc-700 rounded-xl p-5 text-gray-200 leading-7 resize-y"
                    placeholder="AI result..."
                  />

                </div>
              )}

            </div>
          )}

          {/* -------------------------------- */}
          {/* CLEAR */}
          {/* -------------------------------- */}

          {(file || result) && (
            <button
              onClick={clearAll}
              className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl"
            >
              Clear
            </button>
          )}

        </div>

      </div>
    </div>
  );
}