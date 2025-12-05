"use client";

import { useState, useRef, useEffect } from "react";
import { X, Bot, Send } from "lucide-react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import { useAuthStore } from "@/store/useAuthStore";

export default function AiChatWidget({ open, onClose }) {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I'm Codexa AI. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const chatRef = useRef();

    // Auto-scroll to bottom
    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);

    async function sendAiMessage(userQuery) {
        const { userToken } = useAuthStore.getState() // get token outside hooks

        try {
            const res = await api.post(

                ENDPOINTS.AI_CHAT,
                {
                    message: userQuery,
                    history: messages
                },
                // body
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            return res.data;
        } catch (err) {
            console.error("AI request failed:", err);
            throw err;
        }
    }
    async function handleSendMessage() {
        if (!input.trim()) return;

        // Show user message
        setMessages(prev => [...prev, { role: "user", content: input }]);

        const userQuery = input;
        setInput("");

        const res = await sendAiMessage(userQuery);

        setMessages(prev => [...prev, { role: "assistant", content: res.response }]);
    }


    if (!open) return null;

    return (
        <div className="
      fixed right-4 bottom-4 
      w-[360px] h-[500px]
      bg-background border rounded-xl shadow-xl 
      flex flex-col z-50
    ">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center gap-2">
                    <Bot className="text-primary" />
                    <span className="font-bold">Codexa AI</span>
                </div>
                <X onClick={onClose} className="cursor-pointer hover:opacity-70" />
            </div>

            {/* Messages Area */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded-lg max-w-[80%] ${m.role === "assistant"
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-200 dark:bg-gray-700"
                            }`}
                    >
                        {m.content}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="flex items-center p-2 border-t gap-2">
                <input
                    className="flex-1 border rounded-lg p-2 bg-background"
                    placeholder="Ask Codexa..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                    onClick={handleSendMessage}
                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary/80"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
