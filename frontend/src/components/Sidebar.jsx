import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar({ onNewChat }) {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      name: "AI Chat",
      icon: <MessageSquare size={20} />,
      path: "/ai-chat",
    },
    {
      name: "New Chat",
      icon: <PlusCircle size={20} />,
      path: "/ai-chat",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];

  return (
    <div className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between">
      <div>
        <div className="p-6 text-2xl font-bold text-cyan-400">
          CryvixAI
        </div>

        <nav className="px-3 space-y-2">
          {menu.map((item) => (
            <Link
  key={item.name}
  to={item.path}
  onClick={item.name === "New Chat" ? onNewChat : undefined}
  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
    location.pathname === item.path
      ? "bg-cyan-500 text-white"
      : "text-gray-300 hover:bg-zinc-800"
  }`}
>
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}