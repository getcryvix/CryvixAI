import { supabase } from "../lib/supabase";

export async function saveMessage(userId, chatId, role, message) {
  console.log("Saving:", {
  userId,
  chatId,
  role,
  message,
});
console.log("chatId:", chatId);
console.log("typeof chatId:", typeof chatId);
  const { error } = await supabase.from("messages").insert([
    {
      user_id: userId,
      chat_id: chatId,
      role,
      message,
    },
  ]);

  if (error) throw error;
}


export async function loadMessages(chatId) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}

export async function clearMessages(userId) {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}

export async function saveMemory(userId, memory) {
  const { data, error } = await supabase
    .from("user_memory")
    .upsert(
      {
        user_id: userId,
        memory,
      },
      {
        onConflict: "user_id",
      }
    )
    .select();

  console.log("saveMemory data:", data);
  console.log("saveMemory error:", error);

  if (error) throw error;
}



export async function loadMemory(userId) {
  const { data, error } = await supabase
    .from("user_memory")
    .select("memory")
    .eq("user_id", userId)
    .single();

  if (error) return "";

  return data?.memory || "";
}

export async function createChat(userId, title = "New Chat") {
  const { data, error } = await supabase
    .from("chats")
    .insert([
      {
        user_id: userId,
        title,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function loadChats(userId) {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function updateChatTitle(chatId, title) {
  const { error } = await supabase
    .from("chats")
    .update({ title })
    .eq("id", chatId);

  if (error) throw error;
}

export async function deleteChat(userId, chatId) {
  // Pehle messages delete karo
  const { error: messagesError } = await supabase
    .from("messages")
    .delete()
    .eq("chat_id", chatId)
    .eq("user_id", userId);

  if (messagesError) throw messagesError;

  // Phir chat delete karo
  const { error: chatError } = await supabase
    .from("chats")
    .delete()
    .eq("id", chatId)
    .eq("user_id", userId);

  if (chatError) throw chatError;

  return true;
}


