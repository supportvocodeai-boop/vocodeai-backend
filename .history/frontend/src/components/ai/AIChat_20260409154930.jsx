import { useState, useEffect } from "react";
import { useAI } from "../../context/AIContext";
import VoiceInput from "./VoiceInput";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import "../../styles/ai.css";

export default function AIChat({ workspaceId, onClose }) {
  const { sendMessage, messages, loading } = useAI();
  const [input, setInput] = useState("");

  // ✅ Show default welcome message
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage(
        "Hello! I'm VocodeAI, your intelligent coding assistant. How can I help you today?",
        workspaceId,
        true 
      );
    }
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, workspaceId);
    setInput("");
  };

  const quickActions = [
    "Explain this code",
    "Debug my function",
    "Optimize performance",
    "Write tests",
  ];

  return (
    <div className="ai-container">

      {/* HEADER */}
      <div className="ai-header">
        <div className="ai-title">✨ VocodeAI</div>
        <button className="ai-close" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="ai-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content}
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="ai-actions">
        {quickActions.map((q, i) => (
          <button key={i} onClick={() => sendMessage(q, workspaceId)}>
            {q}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div className="ai-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask VocodeAI..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <VoiceInput onCommand={(cmd) => sendMessage(cmd, workspaceId)} />

        <button className="send-btn" onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>

      {loading && <div className="ai-loading">Thinking...</div>}
    </div>
  );
}