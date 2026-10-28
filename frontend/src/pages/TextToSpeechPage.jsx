import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function TextToSpeechPage() {
  const [text, setText] = useState("");

  const speakText = () => {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
  };

  const clearText = () => {
    speechSynthesis.cancel();
    setText("");
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">
          AI Text to Speech
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 max-w-3xl space-y-4">

          <textarea
            placeholder="Type something here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-48 p-4 rounded-lg bg-gray-800 border border-gray-700 outline-none"
          />

          <div className="flex gap-4">

            <button
              onClick={speakText}
              className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700"
            >
              🔊 Speak
            </button>

            <button
              onClick={stopSpeaking}
              className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700"
            >
              ⏹ Stop
            </button>

            <button
              onClick={clearText}
              className="bg-gray-700 px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              🗑 Clear
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}