import { supabase } from "../lib/supabase";

export async function saveMessage(userId, role, message) {
  const { error } = await supabase.from("messages").insert([
    {
      user_id: userId,
      role,
      message,
    },
  ]);

  if (error) throw error;
}

export async function loadMessages(userId) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", userId)
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