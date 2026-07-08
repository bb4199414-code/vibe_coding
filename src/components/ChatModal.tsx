"use client";

import React, { useState, useRef, useEffect, memo } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Memoized Message Item Component for efficiency
const MessageItem = memo(({ msg }: { msg: Message }) => {
  return (
    <div className={msg.role === "user" ? "chat-msg-user" : "chat-msg-ai"}>
      {msg.content}
    </div>
  );
});
MessageItem.displayName = "MessageItem";

export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-msg",
      role: "assistant",
      content: "Hi! I am Nexus AI. I can help you with stadium navigation, food wait times, and accessibility routes. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMsgId = `${Date.now()}-user`;
    setMessages(prev => [...prev, { id: userMsgId, role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const assistantMsgId = `${Date.now()}-assistant`;
      setMessages(prev => [...prev, { id: assistantMsgId, role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMsgId = `${Date.now()}-error`;
      setMessages(prev => [...prev, { id: errorMsgId, role: "assistant", content: "Sorry, I am having trouble connecting to the network right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className="btn-primary chat-fab" 
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Open AI Assistant"
      >
        ✨
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="glass-panel chat-modal-container">
          
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-title">
              <span style={{ fontSize: "1.5rem" }}>🤖</span>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>Nexus AI Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="chat-close-btn"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div 
            aria-live="polite"
            className="chat-messages-container"
          >
            {messages.map((msg) => (
              <MessageItem key={msg.id} msg={msg} />
            ))}
            {isLoading && (
              <div style={{
                alignSelf: "flex-start",
                padding: "1rem 1.2rem",
                borderRadius: "20px 20px 20px 0px",
                background: "rgba(255, 255, 255, 0.05)",
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                display: "flex",
                gap: "5px"
              }}>
                <span className="dot-anim">.</span>
                <span className="dot-anim" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="dot-anim" style={{ animationDelay: "0.4s" }}>.</span>
                <style>{`
                  .dot-anim {
                    animation: blink 1.4s infinite both;
                  }
                  @keyframes blink {
                    0% { opacity: 0.2; }
                    20% { opacity: 1; }
                    100% { opacity: 0.2; }
                  }
                `}</style>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <input 
              id="chat-input"
              aria-label="Type your message for Nexus AI"
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for directions or food wait times..."
              className="chat-input-field"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="btn-primary chat-send-btn"
              style={{ 
                background: input.trim() && !isLoading ? "var(--color-neon-teal)" : "rgba(255,255,255,0.1)",
                opacity: input.trim() && !isLoading ? 1 : 0.5,
                boxShadow: input.trim() && !isLoading ? "0 4px 15px rgba(16, 185, 129, 0.4)" : "none"
              }}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
