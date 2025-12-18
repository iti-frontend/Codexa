"use client";
import { useState, useRef, useEffect } from "react";
import { X, Bot, Send, Mic, MicOff, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import { useAuthStore } from "@/store/useAuthStore";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

export default function AiChatWidget({ open, onClose }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello! I'm Codexa AI. How can I help you today?",
            timestamp: new Date()
        }
    ]);

    const [input, setInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [aiTyping, setAiTyping] = useState(false);
    const [enableTts, setEnableTts] = useState(true);
    const [minimized, setMinimized] = useState(false);
    const { userToken, userInfo } = useAuthStore();


    const chatRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Smooth scroll
    useEffect(() => {
        const el = chatRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [messages, aiTyping]);

    // Format timestamps like "13:40"
    const formatTime = (date) =>
        new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // -----------------------
    // Audio Recording
    // -----------------------
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                sendVoiceToText(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mic error:", err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    // -----------------------
    // Voice → Text
    // -----------------------
    const sendVoiceToText = async (audioBlob) => {
        const formData = new FormData();
        formData.append("file", audioBlob, "voice.webm");

        try {
            const res = await api.post(ENDPOINTS.VOICE_TO_TEXT, formData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.data?.text?.trim()) handleSendMessage(res.data.text);
        } catch (err) {
            console.error("STT Error:", err);
        }
    };

    // -----------------------
    // Text → AI
    // -----------------------
    const sendAiMessage = async (message) => {
        // const { userToken } = useAuthStore.getState();

        const res = await api.post(
            ENDPOINTS.AI_CHAT,
            { message },
            { headers: { Authorization: `Bearer ${userToken}` } }
        );

        return res.data;
    };

    const playAiVoice = async (text) => {
        if (!enableTts) return;

        // const { userToken } = useAuthStore.getState();

        try {
            const res = await api.post(
                ENDPOINTS.TEXT_TO_VOICE,
                { text },
                {
                    responseType: "arraybuffer",
                    headers: { Authorization: `Bearer ${userToken}` }
                }
            );

            new Audio(URL.createObjectURL(new Blob([res.data]))).play();
        } catch (err) {
            console.error("TTS Error:", err);
        }
    };

    // -----------------------
    // Handle Send
    // -----------------------
    const handleSendMessage = async (forced) => {
        const finalMessage = forced || input;
        if (!finalMessage.trim()) return;

        setMessages(prev => [
            ...prev,
            { role: "user", content: finalMessage, timestamp: new Date() }
        ]);

        setInput("");

        setAiTyping(true);
        const aiRes = await sendAiMessage(finalMessage);
        setAiTyping(false);

        setMessages(prev => [
            ...prev,
            { role: "assistant", content: aiRes.response, timestamp: new Date() }
        ]);
        if (!userToken) {
            alert("Please login to use Codexa AI");
            return;
        }


        playAiVoice(aiRes.response);
    };

    if (!open) return null;

    return (
        <div className="fixed right-4 bottom-4 w-[360px] z-50">

            {/* Minimized Mode */}
            {minimized && (
                <Button
                    className="rounded-full shadow-lg px-4 py-2 flex items-center gap-2"
                    onClick={() => setMinimized(false)}
                >
                    <Bot size={18} />
                    Chat with Codexa
                    <ChevronUp />
                </Button>
            )}

            {!minimized && (
                <Card className="h-[500px] flex flex-col shadow-xl border rounded-xl">

                    {/* Header */}
                    <div className="flex justify-between items-center p-3 border-b">
                        <div className="flex items-center gap-2">
                            <Bot className="text-primary" />
                            <span className="font-bold">Codexa AI</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <ChevronDown
                                className="cursor-pointer hover:text-primary"
                                onClick={() => setMinimized(true)}
                            />
                            <X onClick={onClose} className="cursor-pointer hover:opacity-70" />
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        ref={chatRef}
                        className="flex-1 overflow-y-auto p-3 space-y-4 bg-background"
                    >
                        {messages.map((m, i) => (
                            <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"
                                }`}>

                                {/* Avatar */}
                                {m.role === "assistant" && (
                                    <Bot className="w-6 h-6 text-primary opacity-70" />
                                )}

                                {/* Bubble */}
                                <div className={`p-3 rounded-2xl max-w-[70%] text-sm ${m.role === "user"
                                    ? "bg-primary text-white"
                                    : "bg-muted text-foreground"
                                    }`}>
                                    {m.content}
                                    <div className="text-[10px] opacity-70 mt-1">
                                        {formatTime(m.timestamp)}
                                    </div>
                                </div>

                                {/* User avatar (optional) */}
                                {m.role === "user" && (
                                    <Image
                                        src={userInfo?.profileImage || "/default-avatar.png"}
                                        width={26}
                                        height={26}
                                        alt="me"
                                        className="rounded-full"
                                    />
                                )}
                            </div>
                        ))}

                        {/* AI Typing */}
                        {aiTyping && (
                            <div className="flex gap-2 items-center ml-1 text-primary">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></div>
                            </div>
                        )}

                        {/* Recording */}
                        {isRecording && (
                            <div className="flex items-center justify-center gap-2 text-red-500">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                                <span className="text-xs">Recording...</span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t p-3 space-y-2">

                        <div className="flex items-center gap-2 text-sm">
                            <Switch checked={enableTts} onCheckedChange={setEnableTts} />
                            <span>AI Voice Reply</span>
                        </div>

                        <div className="flex items-center gap-2">

                            {/* Mic */}
                            <Button
                                onClick={isRecording ? stopRecording : startRecording}
                                size="icon"
                                className={isRecording ? "bg-red-500 animate-pulse" : "bg-primary"}
                            >
                                {isRecording ? <MicOff /> : <Mic />}
                            </Button>

                            {/* Text Box (auto resize effect) */}
                            <Input
                                placeholder="Ask Codexa…"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                className="flex-1"
                            />

                            {/* Send */}
                            <Button onClick={() => handleSendMessage()}>
                                <Send size={16} />
                            </Button>
                        </div>
                    </div>

                </Card>
            )}
        </div>
    );
}
