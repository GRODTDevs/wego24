import { useEffect, useState, useRef } from "react";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/contexts/AuthContext";

export default function SupportChat({ orderId = null }) {
  const { settings } = useSystemSettings();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch user's chats
  useEffect(() => {
    setLoading(true);
    supabase
      .from("chats")
      .select("*")
      .contains("participants", [user.id])
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setChats(data || []);
        setLoading(false);
      });
  }, [user]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) {
      return;
    }
    supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_id", activeChat.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));
    // Subscribe to new messages
    const sub = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `chat_id=eq.${activeChat.id}` },
        (payload) => setMessages((msgs) => [...msgs, payload.new])
      )
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [activeChat]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start or open a chat
  const startChat = async () => {
    let chat = chats.find((c) => c.order_id === orderId && c.status === "active");
    if (!chat) {
      const { data } = await supabase
        .from("chats")
        .insert({
          order_id: orderId,
          participants: [user.id],
          type: orderId ? "customer-driver" : "customer-support",
        })
        .select()
        .single();
      chat = data;
      setChats((prev) => [data, ...prev]);
    }
    setActiveChat(chat);
  };

  // Send a message
  const sendMessage = async () => {
    if (!activeChat || !newMessage.trim()) {
      return;
    }
    await supabase.from("chat_messages").insert({
      chat_id: activeChat.id,
      sender_id: user.id,
      message: newMessage.trim(),
    });
    setNewMessage("");
  };

  if (!settings.enable_support_chat) {
    return null;
  }
  if (!user) return <div>Please sign in to use support chat.</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Support Chat</h2>
      <div className="mb-4">
        <Button onClick={startChat} disabled={!!activeChat}>Start New Chat</Button>
      </div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {chats.map((chat) => (
          <Button key={chat.id} size="sm" variant={activeChat?.id === chat.id ? "default" : "outline"} onClick={() => setActiveChat(chat)}>
            {chat.type === "customer-support" ? "Support" : `Order #${chat.order_id}`}
          </Button>
        ))}
      </div>
      {activeChat && (
        <div className="border rounded p-2 h-64 flex flex-col overflow-y-auto bg-gray-50">
          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`my-1 ${msg.sender_id === user.id ? "text-right" : "text-left"}`}>
                <span className="inline-block px-2 py-1 rounded bg-red-100 text-sm">{msg.message}</span>
                <div className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleTimeString()}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2 mt-2">
            <input
              className="flex-1 border rounded px-2 py-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} size="sm">Send</Button>
          </div>
        </div>
      )}
    </div>
  );
}
