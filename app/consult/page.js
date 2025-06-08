"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUser, requireAuth } from "@/app/utils/auth";

export default function ConsultPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser && requireAuth(router.pathname)) {
      router.replace('/login');
      return;
    }
    setUser(currentUser);
    fetchMessages(currentUser?.username);
  }, [router.pathname]);

  const fetchMessages = async (username) => {
    if (!username) return;

    try {
      const res = await fetch(`/api/consultations?username=${username}`);
      const data = await res.json();
      
      if (data.success && data.consultation) {
        setMessages(data.consultation.messages || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !user || sendingMessage) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      _id: tempId,
      content: input.trim(),
      username: user.username,
      role: 'user',
      timestamp: new Date().toISOString(),
      pending: true
    };

    setInput("");
    setMessages(prev => [...prev, newMessage]);
    setSendingMessage(true);

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: newMessage.content,
          username: user.username,
          role: 'user'
        }),
      });

      const data = await res.json();
      
      if (data.success && data.messages) {
        // Replace temporary message with server response
        setMessages(data.messages);
      } else {
        // Remove failed message
        setMessages(prev => prev.filter(msg => msg._id !== tempId));
      }
    } catch (error) {
      console.error("Error:", error);
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-medium text-purple-800">
            Konsultasi dengan Dokter
          </h2>
        </div>

        <div className="h-[400px] overflow-y-auto mb-4 p-2">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">
              Mulai konsultasi dengan dokter
            </p>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg._id || msg.timestamp}
                  className={`mb-4 flex ${
                    msg.role === 'doctor' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.role === 'doctor'
                        ? 'bg-gray-100'
                        : 'bg-purple-100'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <small className="text-gray-500 block mt-1">
                      {msg.pending ? (
                        <span className="flex items-center gap-1 text-xs italic">
                          <span className="animate-pulse">Mengirim...</span>
                        </span>
                      ) : (
                        new Date(msg.timestamp).toLocaleString('id-ID')
                      )}
                    </small>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="flex gap-2 border-t pt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder="Ketik pesan..."
            className="flex-1 p-2 border rounded"
            disabled={sendingMessage}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={sendingMessage || !input.trim()}
          >
            {sendingMessage ? 'Mengirim...' : 'Kirim'}
          </button>
        </div>
      </div>
    </div>
  );
}