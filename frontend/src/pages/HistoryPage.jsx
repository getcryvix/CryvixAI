import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("cryvixHistory")) || [];

    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    if (!window.confirm("Delete all history?")) return;

    localStorage.removeItem("cryvixHistory");
    setHistory([]);
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-8">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">
            📜 History
          </h1>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl"
            >
              🗑 Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl p-6">
            <p className="text-gray-400">
              No history found.
            </p>

            <p className="mt-3 text-gray-500">
              Your AI generated content will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {history.map((item, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-xl p-5 border border-white/10"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-cyan-400">
                    {item.type || "AI Content"}
                  </h2>

                  <span className="text-sm text-gray-500">
                    {item.date || ""}
                  </span>
                </div>

                {item.prompt && (
                  <p className="text-gray-400 mb-3">
                    <strong>Request:</strong> {item.prompt}
                  </p>
                )}

                <div className="bg-black/30 rounded-lg p-4 whitespace-pre-wrap text-gray-200">
                  {item.result}
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}