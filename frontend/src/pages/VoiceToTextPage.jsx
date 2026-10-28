import Sidebar from "../components/Sidebar";
import { useState } from "react";
export default function VoiceToTextPage() {
const [text, setText] = useState("");

const startListening = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    setText(event.results[0][0].transcript);
  };

  recognition.start();
};
  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">
          AI Voice to Text
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 max-w-3xl space-y-4">

  <button
    onClick={startListening}
    className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700"
  >
    🎤 Start Recording
  </button>

  <textarea
    value={text}
    readOnly
    placeholder="Your speech will appear here..."
    className="w-full h-40 p-3 rounded bg-gray-800"
  />

</div>
      </div>
    </div>
  );
}