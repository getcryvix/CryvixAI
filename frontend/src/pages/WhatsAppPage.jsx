import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function WhatsAppPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);

  const generateReply = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Write a ${tone} WhatsApp reply for this message:\n\n${message}`,
          messages: [],
        }),
      });

      const data = await res.json();
      setReply(data.reply || "No reply generated.");
    } catch {
      setReply("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-6">
          📱 WhatsApp Reply Generator
        </h1>

        <select
          className="w-full mb-4 p-3 rounded-xl text-black"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Professional</option>
          <option>Friendly</option>
          <option>Formal</option>
          <option>Polite</option>
        </select>

        <textarea
          className="w-full h-40 p-4 rounded-xl text-black"
          placeholder="Paste the WhatsApp message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={generateReply}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
          >
            {loading ? "Generating..." : "Generate Reply"}
          </button>

          <button
            onClick={() => {
              setMessage("");
              setReply("");
            }}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl"
          >
            Clear
          </button>
        </div>

        {reply && (
          <div className="mt-6">
            <button
              onClick={() => navigator.clipboard.writeText(reply)}
              className="mb-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              📋 Copy
            </button>

            <div className="p-4 rounded-xl bg-zinc-900 whitespace-pre-wrap">
              {reply}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}