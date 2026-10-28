import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { translateText } from "../api/translatorApi";

const languages = [
  "Auto Detect",
  "English",
  "Hindi",
  "Urdu",
  "Bengali",
  "Punjabi",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Odia",
  "Assamese",
  "Nepali",
  "Sanskrit",
  "French",
  "German",
  "Spanish",
  "Portuguese",
  "Italian",
  "Dutch",
  "Russian",
  "Ukrainian",
  "Polish",
  "Czech",
  "Slovak",
  "Romanian",
  "Hungarian",
  "Greek",
  "Bulgarian",
  "Serbian",
  "Croatian",
  "Slovenian",
  "Bosnian",
  "Albanian",
  "Macedonian",
  "Turkish",
  "Arabic",
  "Hebrew",
  "Persian",
  "Pashto",
  "Chinese",
  "Japanese",
  "Korean",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Malay",
  "Filipino",
  "Burmese",
  "Khmer",
  "Lao",
  "Mongolian",
  "Kazakh",
  "Uzbek",
  "Turkmen",
  "Kyrgyz",
  "Tajik",
  "Azerbaijani",
  "Armenian",
  "Georgian",
  "Swedish",
  "Danish",
  "Norwegian",
  "Finnish",
  "Icelandic",
  "Estonian",
  "Latvian",
  "Lithuanian",
  "Irish",
  "Welsh",
  "Afrikaans",
  "Swahili",
  "Zulu",
  "Xhosa",
  "Amharic",
  "Somali",
  "Hausa",
  "Yoruba",
  "Igbo",
  "Sinhala",
  "Dari",
  "Kurdish",
  "Belarusian",
  "Catalan",
  "Basque",
  "Galician",
  "Maltese",
  "Latin",
  "Esperanto",
];

export default function TranslatorPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [fromLanguage, setFromLanguage] =
    useState("Auto Detect");
  const [toLanguage, setToLanguage] =
    useState("English");
  const [loading, setLoading] =
    useState(false);

  async function handleTranslate() {
    if (!input.trim()) {
      alert("Please enter some text first.");
      return;
    }

    if (fromLanguage === toLanguage) {
      setOutput(input);
      return;
    }

    try {
      setLoading(true);

      const result = await translateText(
        input,
        fromLanguage,
        toLanguage
      );

      setOutput(result);
    } catch (err) {
      console.error("Translation error:", err);
      alert("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function swapLanguages() {
    if (fromLanguage === "Auto Detect") {
      alert("Select a source language before swapping.");
      return;
    }

    const oldFrom = fromLanguage;
    const oldTo = toLanguage;

    setFromLanguage(oldTo);
    setToLanguage(oldFrom);

    setInput(output);
    setOutput(input);
  }

  async function copyOutput() {
    if (!output.trim()) return;

    try {
      await navigator.clipboard.writeText(output);
      alert("Translated text copied!");
    } catch (error) {
      console.error(error);
    }
  }

  function clearAll() {
    setInput("");
    setOutput("");
  }

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🌍</span>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                AI Translator
              </h1>

              <p className="text-zinc-400 mt-1">
                Translate text instantly into 100+ languages
              </p>
            </div>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-zinc-900 rounded-2xl p-5 md:p-7 border border-zinc-800 shadow-xl">

          {/* LANGUAGE SELECTORS */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                From
              </label>

              <select
                value={fromLanguage}
                onChange={(e) =>
                  setFromLanguage(e.target.value)
                }
                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapLanguages}
              className="bg-cyan-600 hover:bg-cyan-500 px-5 py-3 rounded-xl font-semibold transition"
              title="Swap languages"
            >
              🔄
            </button>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                To
              </label>

              <select
                value={toLanguage}
                onChange={(e) =>
                  setToLanguage(e.target.value)
                }
                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl outline-none"
              >
                {languages
                  .filter((lang) => lang !== "Auto Detect")
                  .map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
              </select>
            </div>

          </div>

          {/* TEXT AREAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

            {/* INPUT */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-zinc-400">
                  Enter text
                </label>

                <span className="text-xs text-zinc-500">
                  {input.length} characters
                </span>
              </div>

              <textarea
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                placeholder="Type or paste your text here..."
                className="w-full h-56 rounded-xl bg-zinc-800 border border-zinc-700 p-4 outline-none resize-none focus:border-cyan-500"
              />
            </div>

            {/* OUTPUT */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-zinc-400">
                  Translation
                </label>

                {output && (
                  <button
                    onClick={copyOutput}
                    className="text-sm text-green-400 hover:text-green-300"
                  >
                    📋 Copy
                  </button>
                )}
              </div>

              <textarea
                value={output}
                readOnly
                placeholder="Your translation will appear here..."
                className="w-full h-56 rounded-xl bg-zinc-800 border border-zinc-700 p-4 outline-none resize-none"
              />
            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 mt-6">

            <button
              onClick={handleTranslate}
              disabled={loading || !input.trim()}
              className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 px-8 py-3 rounded-xl font-semibold transition"
            >
              {loading
                ? "⏳ Translating..."
                : "🌐 Translate"}
            </button>

            <button
              onClick={clearAll}
              disabled={!input && !output}
              className="bg-red-500 hover:bg-red-400 disabled:bg-zinc-700 disabled:text-zinc-500 px-6 py-3 rounded-xl font-semibold transition"
            >
              🗑 Clear
            </button>

          </div>

        </div>

        {/* INFO */}
        <div className="mt-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
          <h2 className="font-semibold text-lg mb-2">
            ✨ CryvixAI Translation
          </h2>

          <p className="text-sm text-zinc-400">
            Translate messages, emails, documents and everyday
            text between multiple languages using AI.
          </p>
        </div>

      </main>
    </div>
  );
}