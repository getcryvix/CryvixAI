import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  FileText,
  ScrollText,
  History,
  User,
  Settings,
  LogOut,
  Mic,
  Volume2,
 CreditCard,
FolderKanban
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from 'react'
export default function Sidebar({ onNewChat }) {
  const location = useLocation();
  const navigate = useNavigate();

const [plan, setPlan] = useState('Free');

useEffect(() => {
  const fetchPlan = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Sidebar plan error:', error);
      return;
    }

    setPlan(data?.status === 'active' ? data.plan : 'Free');
  };

  fetchPlan();
}, []);

  const handleLogout = async () => {
  await supabase.auth.signOut();
  navigate("/login");
};

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },

{
  name: "My Workspace",
  icon: <FolderKanban size={20} />,
  path: "/projects",
},

    {
      name: "AI Chat",
      icon: <MessageSquare size={20} />,
      path: "/ai-chat",
    },
    {
  name: "AI Writer",
  icon: <Settings size={20} />,
  path: "/ai-writer",
},
{
  name: "Email Writer",
  icon: <FileText size={20} />,
  path: "/email-writer",
},

{
  name: "AI Code",
  icon: <Settings size={20} />,
  path: "/ai-code",
},

{
  name: "Prompt Generator",
  icon: <FileText size={20} />,
  path: "/prompt-generator",
},

{
  name: "Invoice",
  icon: <FileText size={20} />,
  path: "/invoice",
},
{
  name: "WhatsApp",
  icon: <MessageSquare size={20} />,
  path: "/whatsapp",
},
{
  name: "Proposal",
  icon: <ScrollText size={20} />,
  path: "/proposal",
},
{
  name: "Resume Builder",
  icon: <FileText size={20} />,
  path: "/resume-builder",
},
{
  name: "Excel Formula",
  icon: <FileText size={20} />,
  path: "/excel-formula",
},

{
  name: "Grammar & Rewriter",
  icon: <FileText size={20} />,
  path: "/grammar-rewriter",
},

{
  name: "Cover Letter",
  icon: <FileText size={20} />,
  path: "/cover-letter",
},
{
  name: "PDF Chat",
  icon: <FileText size={20} />,
  path: "/pdf-chat",
},
{
  name: "Voice to Text",
  icon: <Mic size={20} />,
  path: "/voice-to-text",
},
{
  name: "AI Translator",
  icon: <FileText size={20} />,
  path: "/translator",
},

{
  name: "Summarizer",
  icon: <FileText size={20} />,
  path: "/summarizer",
},

{
  name: "Document Summarizer",
  icon: <FileText size={20} />,
  path: "/document-summary",
},

{
  name: "AI OCR",
  icon: <FileText size={20} />,
  path: "/ai-ocr",
},

{
  name: "Presentation Generator",
  icon: <FileText size={20} />,
  path: "/presentation-generator",
},
{
  name: "Website Builder",
  icon: <Settings size={20} />,
  path: "/website-builder",
},
{
  name: "Text to Speech",
  icon: <Volume2 size={20} />,
  path: "/text-to-speech",
},
{
  name: "Pricing",
  icon: <CreditCard size={20} />,
  path: "/pricing",
},
{
  name: "History",
  icon: <History size={20} />,
  path: "/history",
},
{
  name: "Profile",
  icon: <User size={20} />,
  path: "/profile",
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
        <div className="p-6 border-b border-zinc-800">
  <h1 className="text-2xl font-bold text-cyan-400">
    CryvixAI
  </h1>

  <p className="mt-2 text-sm text-gray-400">
    AI Workspace
  </p>

  <div className="mt-4 rounded-xl bg-zinc-900 p-3 border border-zinc-800">
    <p className="text-xs text-gray-400">
      Current Plan
    </p>

    <p className="mt-1 font-semibold text-green-400">
  {plan} Plan
</p>
  </div>
</div>

        <nav className="px-3 space-y-2">
          {menu.map((item) => (
            <Link
  key={item.name}
  to={item.path}
  onClick={item.name === "New Chat" ? onNewChat : undefined}
  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
  location.pathname === item.path
    ? "bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/20"
    : "text-gray-300 border-transparent hover:bg-zinc-800 hover:border-zinc-700 hover:translate-x-1"
}`}
>
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
  <p className="text-xs text-gray-400">
    CryvixAI Version
  </p>

  <h3 className="mt-1 text-lg font-bold text-cyan-400">
    v1.0 MVP
  </h3>

  <p className="mt-2 text-xs text-gray-500">
    Launch Mode 🚀
  </p>
</div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}