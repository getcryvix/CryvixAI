import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import WebsitePreview from "../components/WebsitePreview";
import {
  saveProject,
  loadProject,
} from "../utils/projectStorage";

import {
  generateWebsite,
  editWebsite,
  downloadWebsite,
  openWebsite,
  downloadWebsiteZip,
  exportReactProject,
  exportReactProjectV2,
  publishWebsite
} from "../api/websiteBuilderApi";

export default function WebsiteBuilderPage() {

  const [prompt, setPrompt] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [instruction, setInstruction] = useState("");
  useEffect(() => {
  const project = loadProject();

  if (project) {
    setPrompt(project.prompt || "");
    setWebsite(project.website || "");
  }
}, []);

  async function handleGenerate() {

    if (!prompt.trim()) {
      alert("Please enter website idea");
      return;
    }

    try {

      setLoading(true);

      const result = await generateWebsite(prompt);

      setWebsite(result);

      saveProject({
  prompt,
  website: result,
});

    } catch (error) {

      console.error(error);

      alert("Website generation failed");

    } finally {

      setLoading(false);

    }

  }

  function handleCopy() {

    navigator.clipboard.writeText(website);

    alert("Copied");

  }

  function handleClear() {

    setPrompt("");

    setWebsite("");

  }

  async function handleEdit() {

  if (!website.trim()) {
    alert("Generate a website first.");
    return;
  }

  if (!instruction.trim()) {
    alert("Enter an editing instruction.");
    return;
  }

  try {

    setLoading(true);

    const updatedWebsite = await editWebsite(
      website,
      instruction
    );

    setWebsite(updatedWebsite);

    setInstruction("");

  } catch (error) {

    console.error(error);

    alert("Website editing failed.");

  } finally {

    setLoading(false);

  }

}

async function handlePublish() {

  if (!website.trim()) {
    alert("Generate a website first.");
    return;
  }

  try {

    const result = await publishWebsite(website);

    alert(result.message);

  } catch (error) {

    console.error(error);

    alert("Publishing failed.");

  }

}

  return (

    <div className="flex min-h-screen bg-surface text-white">

      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-4xl font-bold mb-2">

          AI Website Builder

        </h1>

        <p className="text-gray-400 mb-8">

          Generate complete AI websites.

        </p>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">

          <label className="block mb-3">

            Website Prompt

          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a modern gym website"
            className="w-full h-40 rounded-xl bg-zinc-800 border border-zinc-700 p-4"
          />

          <div className="flex gap-4 mt-6">

            <button
              onClick={handleGenerate}
              className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
            >
              {loading ? "Generating..." : "Generate Website"}
            </button>

            <button
              onClick={handleCopy}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
            >
              Copy
            </button>

            <button
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl"
            >
              Clear
            </button>

          </div>

          <div className="mt-8">

  <label className="block mb-3">
    AI Edit Instruction
  </label>

  <textarea
    value={instruction}
    onChange={(e) => setInstruction(e.target.value)}
    placeholder="Example: Make the buttons blue, add pricing section..."
    className="w-full h-24 rounded-xl bg-zinc-800 border border-zinc-700 p-4"
  />

  <button
    onClick={handleEdit}
    className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl"
  >
    ✨ Edit Website with AI
  </button>

</div>

          <div className="mt-8">

            <label className="block mb-3">

              Generated Website Code

            </label>

            <textarea
              readOnly
              value={website}
              className="w-full h-[500px] rounded-xl bg-zinc-800 border border-zinc-700 p-4 outline-none resize-none"
            />
            {website && (

            <div className="mt-8 rounded-xl border border-cyan-500 bg-cyan-500/10 p-5">

              <h2 className="text-xl font-bold text-cyan-400 mb-2">

                Website Ready 🚀

              </h2>

              <p className="text-gray-300">

                Your AI generated website is ready.

              </p>

              <div className="flex flex-wrap gap-4 mt-5">

                <button
                  onClick={handleCopy}
                  className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl"
                >
                  Copy Code
                </button>

                <button
                  onClick={() => downloadWebsite(website)}
                  className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl"
                >
                  Download HTML
                </button>

                <button
                  onClick={() => downloadWebsiteZip(website)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-xl"
                >
                  Download ZIP
                </button>

                <button
                  onClick={() => exportReactProject(website)}
                  className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl"
                >
                  Export React Project
                </button>

                <button
  onClick={() => exportReactProjectV2(website)}
  className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl"
>
  Export React V2
</button>

                <button
                  onClick={() => openWebsite(website)}
                  className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl"
                >
                  Open Website
                </button>

                <button
  onClick={handlePublish}
  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
>
  🌍 Publish Website
</button>

              </div>

            </div>

          )}

          {website && (

  <WebsitePreview code={website} />

)}

        </div>

      </div>

    </div>

    </div>

  );

}
