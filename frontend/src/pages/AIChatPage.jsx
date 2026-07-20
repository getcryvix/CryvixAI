import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";
import { saveMessage, loadMessages } from "../services/Chatservice";

const DAILY_LIMIT = 1000;

export default function AIChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    const handleNewChat = () => {
  setMessages([
    {
      role: "assistant",
      text: "👋 Hello! Welcome to CryvixAI. How can I help you today?",
    },
  ]);

  localStorage.removeItem("cryvix-chat");
};
    const saved = localStorage.getItem("cryvix-chat");

    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "assistant",
            text: "👋 Hello! Welcome to CryvixAI. How can I help you today?",
          },
        ];
  });

  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      console.log("User:", data.user);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchMessages() {
      try {
        const data = await loadMessages(user.id);
        console.log("Loaded messages:", data);

        if (data.length > 0) {
          setMessages(
            data.map((msg) => ({
              role: msg.role,
              text: msg.message,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchMessages();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("cryvix-chat", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    console.log("Send button clicked");
    if (remaining <= 0) {
      setError("🚫 Daily limit reached. Upgrade to CryvixAI Pro.");
      return;
    }

    if (!message.trim()) return;

    const userMessage = message;

    if (user) {
      await saveMessage(user.id, "user", userMessage);
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setRemaining((prev) => prev - 1);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  message: userMessage,
  messages: messages.map((msg) => ({
    role: msg.role,
    content: msg.text,
  })),
}),
      });

      const data = await res.json();
      console.log(data);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);

      if (user) {
        console.log("AI Reply:", data.reply);
        //await saveMessage(user.id, "assistant", data.reply);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Server se connect nahi ho pa raha.",
        },
      ]);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl font-bold mb-6">
            💬 CryvixAI Chat
          </h1>

          <div className="glass rounded-3xl p-6 min-h-[500px]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.role === "user"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                <div
                  className={`inline-block rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-cyan-600"
                      : "bg-zinc-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-3 mt-4 flex justify-between text-sm text-gray-300">
            <span>
              Free Messages Left: {remaining} / {DAILY_LIMIT}
            </span>

            {error && (
              <span className="text-red-400">
                {error}
              </span>
            )}
          </div>
          <div className="flex gap-3 border border-red-500 p-3 rounded-xl">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button
              onClick={handleSend}
              className="bg-cyan-500 px-6 rounded-xl font-semibold"
            >
              Send
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}