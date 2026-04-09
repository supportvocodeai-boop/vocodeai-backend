import { useState, useEffect, useRef } from "react";
import { useAI } from "../../context/AIContext";
import VoiceInput from "./VoiceInput";
import "../../styles/ai.css";

export default function AIChat({ workspaceId }) {
  const { sendMessage, messages, loading } = useAI();
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, workspaceId);
    setInput("");
  };

  // ✅ Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="ai-panel">

      {/* ✅ MESSAGES */}
      <div className="ai-messages">
        {messages.map((m, i) => {
          let text =
            typeof m.content === "string"
              ? m.content
              : m.content?.message || "";

          return (
            <div key={i} className={`msg ${m.role}`}>
              {text}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* ✅ LOADING */}
      {loading && <div className="ai-loading">Thinking...</div>}

      {/* ✅ INPUT */}
      <div className="ai-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask VocodeAI..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <VoiceInput onCommand={(cmd) => sendMessage(cmd, workspaceId)} />

        <button onClick={handleSend}>Send</button>
      </div>

    </div>
  );
}