import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { chatWithPDF } from "../lib/api";
export default function PDFChatPage() {
const [file, setFile] = useState(null);
const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");
const [loading, setLoading] = useState(false);
 const handleAsk = async () => {
  if (!file) {
    alert("Please select a PDF first.");
    return;
  }

  if (!question.trim()) {
    alert("Please enter a question.");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  formData.append("pdf", file);
  formData.append("question", question);

  try {
    const data = await chatWithPDF(formData);
    setAnswer(data.reply);
  } catch (error) {
    alert("Failed to process PDF.");
  } finally {
    setLoading(false);
  }
}; 
return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">
          AI PDF Chat
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 max-w-3xl space-y-4">

  <input
    type="file"
    accept=".pdf"
    onChange={(e) => setFile(e.target.files[0])}
    className="w-full p-3 rounded bg-gray-800"
  />

  <textarea
    placeholder="Ask something about the PDF..."
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    className="w-full p-3 rounded bg-gray-800 h-32"
  />

  <button
  onClick={handleAsk}
  disabled={loading}
  className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700"
>
  {loading ? "Processing..." : "Ask AI"}
</button>
  {answer && (
    <div className="mt-6 rounded-lg bg-gray-800 p-4 whitespace-pre-wrap">
      {answer}
    </div>
  )}

</div>
      </div>
    </div>
  );
}