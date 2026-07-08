"use client";

import React, { useState, useRef, useEffect, memo } from "react";

// Memoized Message Item Component for efficiency
const MessageItem = memo(({ msg }: { msg: { role: "user" | "assistant"; content: string } }) => {
  return (
    <div style={{
      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
      maxWidth: "85%",
      padding: "1rem 1.2rem",
      borderRadius: msg.role === "user" ? "20px 20px 0px 20px" : "20px 20px 20px 0px",
      background: msg.role === "user" ? "linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-pink))" : "rgba(255, 255, 255, 0.1)",
      color: "#fff",
      lineHeight: 1.5,
      fontSize: "0.95rem",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    }}>
      {msg.content}
    </div>
  );
});
MessageItem.displayName = "MessageItem";

export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi! I am Nexus AI. I can help you with stadium navigation, food wait times, and accessibility routes. How can I assist you today?" }
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
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
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
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I am having trouble connecting to the network right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className="btn-primary" 
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
          zIndex: 100,
          boxShadow: "0 8px 30px rgba(16, 185, 129, 0.4)",
          background: "linear-gradient(135deg, var(--color-neon-teal), var(--color-neon-purple))"
        }}
        aria-label="Open AI Assistant"
      >
        ✨
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "6.5rem",
          right: "2rem",
          width: "380px",
          height: "550px",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          animation: "slideUp 0.3s ease-out"
        }} className="glass-panel">
          
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(155, 38, 182, 0.3))",
            padding: "1.2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--glass-border)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>🤖</span>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>Nexus AI Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: "transparent", border: "none", color: "var(--text-main)", cursor: "pointer", fontSize: "1.2rem" }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div 
            aria-live="polite"
            style={{
              flex: 1,
              padding: "1.5rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              scrollBehavior: "smooth"
            }}
          >
            {messages.map((msg, index) => (
              <MessageItem key={index} msg={msg} />
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
          <div style={{
            padding: "1.2rem",
            borderTop: "1px solid var(--glass-border)",
            display: "flex",
            gap: "0.8rem",
            background: "rgba(0, 0, 0, 0.3)"
          }}>
            <input 
              id="chat-input"
              aria-label="Type your message for Nexus AI"
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for directions or food wait times..."
              style={{
                flex: 1,
                padding: "0.8rem 1.2rem",
                borderRadius: "25px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "var(--text-main)",
                outline: "none",
                fontSize: "0.95rem",
                transition: "background 0.3s ease"
              }}
              onFocus={(e) => e.target.style.background = "rgba(255, 255, 255, 0.12)"}
              onBlur={(e) => e.target.style.background = "rgba(255, 255, 255, 0.08)"}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="btn-primary"
              style={{ 
                borderRadius: "50%", 
                width: "45px", 
                height: "45px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
