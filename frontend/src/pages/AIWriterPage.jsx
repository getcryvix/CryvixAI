import { useState } from "react";
import { jsPDF } from "jspdf";
import Sidebar from "../components/Sidebar";
import { chatWithAI } from "../lib/api";
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
      const message = `You are CryvixAI Professional Writer.

Create a high-quality ${type} based on the user's request.

IMPORTANT CONTENT TYPE RULES:

If the selected type is "Instagram Caption":
- Write ONLY the Instagram caption.
- Do NOT write an email.
- Do NOT add a title like "Instagram Caption".
- Do NOT explain the caption.
- Make it engaging, natural and social-media friendly.
- Use emojis naturally when appropriate.
- Include a clear call-to-action when suitable.
- Add 5-10 relevant hashtags at the end.
- Keep it concise and ready to copy directly into Instagram.

If the selected type is "Product Description":
- Write ONLY a professional product description.
- Clearly explain features and benefits.
- Do not invent specifications, prices or claims.
- End with a call-to-action when appropriate.

If the selected type is "Resume":
- Create professional, ATS-friendly resume content.
- Include Summary, Skills, Work Experience and Education where appropriate.
- Do NOT invent qualifications or experience.

If the selected type is "Proposal":
- Write a professional business proposal.
- Include introduction, proposed solution, scope, deliverables, benefits and conclusion.
- Do NOT invent prices or guarantees.

If the selected type is "Blog Article":
- Write a complete article with title, introduction, headings and conclusion.

If the selected type is "YouTube Script":
- Include a hook, introduction, main content and ending/CTA.

For all other types:
- Follow the selected content type exactly.
- Make the content professional, clear and ready to use.
- Do not change the requested content type.

User Request:
${prompt}`;

      const data = await chatWithAI(message, []);

      if (!data.reply) {
        throw new Error(data.message || "Content generation failed.");
      }

      setResult(data.reply);

      const oldHistory =
        JSON.parse(localStorage.getItem("cryvixHistory") || "[]");

      const newHistory = {
        type,
        prompt,
        result: data.reply,
        date: new Date().toLocaleString(),
      };

      localStorage.setItem(
        "cryvixHistory",
        JSON.stringify([newHistory, ...oldHistory].slice(0, 50))
      );
    } catch (err) {
      setResult(err.message || "Server Error");
    } finally {
      setLoading(false);
    }
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
          <option>WhatsApp Reply</option>
<option>LinkedIn Post</option>
<option>Facebook Post</option>
<option>Twitter/X Post</option>
<option>Professional Letter</option>
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