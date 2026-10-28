import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";
import { chatWithAI } from "../lib/api";
import {
  saveMessage,
  loadMessages,
  saveMemory,
  loadMemory,
  createChat,
  loadChats,
  updateChatTitle,
  deleteChat,
} from "../services/Chatservice";
import UpgradeModal from "../components/UpgradeModal";
const DAILY_LIMIT = 5;

const WELCOME_MESSAGE = {
  role: "assistant",
  text: "👋 Hello! Welcome to CryvixAI. How can I help you today?",
};

export default function AIChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);

  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);

  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [error, setError] = useState("");
  const [memory, setMemory] = useState("");
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("Free");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Load actual daily AI usage from backend
useEffect(() => {
  let mounted = true;

  async function fetchUsage() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) return;

      const response = await fetch(
        "http://localhost:3001/api/ai-usage",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load AI usage");
      }

      if (!mounted) return;

      setPlan(data.plan || "Free");

      if (data.usage?.remaining != null) {
        setRemaining(data.usage.remaining);
      }
    } catch (err) {
      console.error("AI usage fetch error:", err);
    }
  }

  fetchUsage();

  return () => {
    mounted = false;
  };
}, []);

  // Get logged-in user
useEffect(() => {
  let mounted = true;

  async function getUser() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session Error:", error);
        return;
      }

      if (mounted) {
        setUser(data.session?.user ?? null);
        console.log("Logged-in User:", data.session?.user ?? null);
      }
    } catch (err) {
      console.error("Auth Error:", err);
    }
  }

  getUser();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        console.log(
          "Auth State Changed:",
          session?.user ?? null
        );
      }
    }
  );

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

// Load user's subscription plan
useEffect(() => {
  let mounted = true;

  async function fetchPlan() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !mounted) return;

    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("AI Chat plan error:", error);
      return;
    }

    if (mounted) {
      setPlan(
        data?.status === "active" ? data.plan : "Free"
      );
    }
  }

  fetchPlan();

  return () => {
    mounted = false;
  };
}, []);

  // Load user's memory and chat list
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const userMemory = await loadMemory(user.id);
        setMemory(userMemory);

        const userChats = await loadChats(user.id);
        setChats(userChats);
      } catch (err) {
        console.error("Fetch Data Error:", err);
      }
    }

    fetchData();
  }, [user]);

  // Load messages only for the selected chat
  useEffect(() => {
    if (!chatId) return;

    async function fetchMessages() {
      try {
        const data = await loadMessages(chatId);

        if (data.length > 0) {
          setMessages(
            data.map((msg) => ({
              role: msg.role,
              text: msg.message,
            }))
          );
        } else {
          setMessages([WELCOME_MESSAGE]);
        }
      } catch (err) {
        console.error("Load Messages Error:", err);
        setMessages([WELCOME_MESSAGE]);
      }
    }

    fetchMessages();
  }, [chatId]);

  // New Chat
  const handleNewChat = async () => {
    try {
      if (!user) return;

      console.log("New Chat clicked");

      const chat = await createChat(user.id, "New Chat");

      console.log("Chat Created:", chat);

      setChatId(chat.id);

      setChats((prev) => [chat, ...prev]);

      setMessages([WELCOME_MESSAGE]);
      setError("");
    } catch (err) {
      console.error("New Chat Error:", err);
      alert(err.message);
    }
  };

  const handleDeleteChat = async (chatIdToDelete) => {
  try {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (!confirmDelete) return;

    await deleteChat(user.id, chatIdToDelete);

    setChats((prev) =>
      prev.filter((chat) => chat.id !== chatIdToDelete)
    );

    if (chatId === chatIdToDelete) {
      setChatId(null);

      setMessages([
        {
          role: "assistant",
          text: "👋 Hello! Welcome to CryvixAI. How can I help you today?",
        },
      ]);
    }

    console.log("Chat deleted:", chatIdToDelete);
  } catch (err) {
    console.error("Delete chat error:", err);
    alert(err?.message || "Failed to delete chat");
  }
};
  

  

  // Send Message
  const handleSend = async () => {
    console.log("Send button clicked");

    const isPaidPlan = ["pro", "business"].includes(
  String(plan).trim().toLowerCase()
);

if (!isPaidPlan && remaining <= 0) {
  setShowUpgradeModal(true);
  return;
}

    if (!message.trim()) return;

    if (!user) {
      setError("Please login first.");
      return;
    }

    const userMessage = message.trim();

    let currentChatId = chatId;

    // Create chat automatically if no chat is selected
    if (!currentChatId) {
      const newChat = await createChat(user.id, "New Chat");

      currentChatId = newChat.id;

      setChatId(currentChatId);

      setChats((prev) => [newChat, ...prev]);
    }

    try {
      setError("");
      setLoading(true);

      // Save user's message
      await saveMessage(
        user.id,
        currentChatId,
        "user",
        userMessage
      );

      // Update chat title only for a new chat
      const currentChat = chats.find(
        (chat) => chat.id === currentChatId
      );

      if (currentChat?.title === "New Chat") {
        const newTitle = userMessage.substring(0, 30);

        await updateChatTitle(
          currentChatId,
          newTitle
        );

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  title: newTitle,
                }
              : chat
          )
        );
      }

      // Show user message immediately
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: userMessage,
        },
      ]);

      setMessage("");
    

      // IMPORTANT:
      // Send only the messages belonging to the CURRENT chat.
      // User memory is separate and can be used across chats.
      let finalMessage = userMessage;

      if (memory) {
        finalMessage = `User Memory:
${memory}

User: ${userMessage}`;
      }

      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));

      const data = await chatWithAI(
        finalMessage,
        conversationHistory
      );

     if (
  data.usage?.request_count != null &&
  !["pro", "business"].includes(
    String(data.plan || plan).trim().toLowerCase()
  )
) {
  setRemaining(
    Math.max(0, DAILY_LIMIT - data.usage.request_count)
  );
}

if (data.plan) {
  setPlan(data.plan);
}


      if (data.usage?.request_count != null) {
  setRemaining(
    Math.max(
      0,
      DAILY_LIMIT - data.usage.request_count
    )
  );
}

if (data.plan) {
  setPlan(data.plan);
}

      // Show AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);

      // Save AI response
      await saveMessage(
        user.id,
        currentChatId,
        "assistant",
        data.reply
      );

      // Save AI Chat to CryvixAI History
const oldHistory =
  JSON.parse(localStorage.getItem("cryvixHistory")) || [];

const newHistory = {
  type: "AI Chat",
  prompt: userMessage,
  result: data.reply,
  date: new Date().toLocaleString(),
};

localStorage.setItem(
  "cryvixHistory",
  JSON.stringify(
    [newHistory, ...oldHistory].slice(0, 50)
  )
);

      // Save simple user memory
      if (
        userMessage.toLowerCase().includes("mera") ||
        userMessage.toLowerCase().includes("my")
      ) {
        const updatedMemory =
          memory + "\n" + userMessage;

        await saveMemory(
          user.id,
          updatedMemory
        );

        setMemory(updatedMemory);
      }
    } catch (err) {
      console.error("FULL ERROR:", err);

      setError(
        err?.message ||
          "Server se connect nahi ho pa raha."
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Server se connect nahi ho pa raha.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">
              💬 CryvixAI Chat
            </h1>

            <button
              onClick={handleNewChat}
              className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl font-semibold"
            >
              ➕ New Chat
            </button>
          </div>

          {/* Chat List */}
          {chats.length > 0 && (
            <div className="mb-4">
              {chats.map((chat) => (
  <div
    key={chat.id}
    className={`flex items-center gap-2 p-2 rounded-lg mb-2 ${
      chat.id === chatId
        ? "bg-cyan-600"
        : "bg-zinc-800"
    }`}
  >
    <button
      onClick={() => {
        setChatId(chat.id);
        setError("");
      }}
      className="flex-1 text-left p-2 hover:opacity-80"
    >
      {chat.title}
    </button>

    <button
      onClick={() => handleDeleteChat(chat.id)}
      className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700"
      title="Delete Chat"
    >
      🗑️
    </button>
  </div>
))}
            </div>
          )}

          {/* Messages */}
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

            {loading && (
              <div className="text-left mb-4">
                <div className="inline-block bg-zinc-800 rounded-2xl px-4 py-3">
                  🤖 CryvixAI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Message Limit */}
          <div className="mb-3 mt-4 flex justify-between text-sm text-gray-300">
            <span>
  {["pro", "business"].includes(
    String(plan).trim().toLowerCase()
  )
    ? `${plan} Plan: Unlimited messages`
    : `Free Messages Left: ${remaining} / ${DAILY_LIMIT}`}
</span>

            {error && (
              <span className="text-red-400">
                {error}
              </span>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-3 border border-red-500 p-3 rounded-xl">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 outline-none"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 px-6 rounded-xl font-semibold"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>

        </div>
      </div>
    
    <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
</div>
  );
}