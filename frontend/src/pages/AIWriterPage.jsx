import { useState } from "react";
import { jsPDF } from "jspdf";
import Sidebar from "../components/Sidebar";

export default function AIWriterPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("Email");

  const generateContent = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `You are a professional AI Writer. Write a ${type}. ${prompt}`,
          messages: [],
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setResult(data.reply);
      } else {
        setResult("Something went wrong.");
      }
    } catch (err) {
      setResult("Server Error");
    }

    setLoading(false);
  };
  const clearAll = () => {
  setPrompt("");
  setResult("");
};

  const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  const lines = doc.splitTextToSize(result, 180);
  doc.text(lines, 15, 20);

  doc.save("CryvixAI-Document.pdf");
};

 

return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-6">
          ✍️ AI Writer
        </h1>

        <select
          className="w-full mb-4 p-3 rounded-xl text-black"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Email</option>
          <option>Blog Article</option>
          <option>YouTube Script</option>
          <option>Instagram Caption</option>
          <option>Product Description</option>
          <option>Resume</option>
          <option>Proposal</option>
        </select>

        <textarea
          className="w-full h-40 p-4 rounded-xl text-black"
          placeholder="Describe what you want AI to write..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="mt-4 flex gap-3">
  <button
    onClick={generateContent}
    className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
  >
    {loading ? "Generating..." : "Generate"}
  </button>

  <button
    onClick={generateContent}
    className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl"
  >
    🔄 Regenerate
  </button>

  <button
    onClick={clearAll}
    className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl"
  >
    Clear
  </button>
</div>

        

        {result && (
          <div className="mt-6">
            <div className="flex justify-end gap-3 mb-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert("Copied successfully!");
                }}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
              >
          
  📋 Copy
    </button>

              <button
                onClick={downloadPDF}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                📄 Download PDF
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}