import {
  useState,
  useRef,
  useEffect,
} from "react";
import { X, Sparkles, Image, FileText } from "lucide-react";

import { useAI } from "../../context/AIContext";
import VoiceInput from "./VoiceInput";

import "../../styles/ai.css";

export default function AIChat({ workspaceId }) {
  const { sendMessage, messages, loading } = useAI();

  const [input, setInput] = useState("");

  const [showGuide, setShowGuide] =
    useState(true);

    const messagesEndRef = useRef(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(input, workspaceId);

    setInput("");
  };

  return (
    <div className="ai-panel">

      {/* ========================================= */}
      {/* AI GUIDE                                 */}
      {/* ========================================= */}

      <div className="ai-scroll-area">

  {/* GUIDE */}
  {showGuide && (
    <div className="ai-guide">

      <div className="ai-guide-header">
        <div className="ai-guide-title">
          <Sparkles size={16} />
          <span>How to use VocodeAI</span>
        </div>

        <button
          className="ai-guide-close"
          onClick={() => setShowGuide(false)}
        >
          <X size={16} />
        </button>
      </div>

      <div className="ai-guide-content">

        <div className="guide-item">
          <span className="guide-number">1</span>

          <div>
            <h4>Mention the file name</h4>

            <p>
              Format:
              <code>
                index.html create a landing page
              </code>
            </p>
          </div>
        </div>

        <div className="guide-item">
          <span className="guide-number">2</span>

          <div>
            <h4>
              Mention the file before editing
            </h4>

            <p>
              Example:
              <code>
                styles.css make the buttons green
              </code>
            </p>
          </div>
        </div>

        <div className="guide-item">
          <span className="guide-number">3</span>

          <div>
            <h4>
              AI can create full projects
            </h4>

            <p>
              Ask for React apps, HTML pages,
              Python scripts, backend APIs
              and more.
            </p>
          </div>
        </div>

        <div className="guide-item">
          <span className="guide-number">4</span>

          <div>
            <h4>Upcoming Features</h4>

            <div className="upcoming-features">

              <div className="feature-chip">
                <Image size={14} />
                Image Upload
              </div>

              <div className="feature-chip">
                <FileText size={14} />
                PDF Upload
              </div>

              <div className="feature-chip">
                🎥 Video Upload
              </div>

              <div className="feature-chip">
                🤖 AI Asset Generation
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )}

  {/* MESSAGES */}
  <div className="ai-messages">

    {messages.length === 0 && (
      <div className="ai-empty">
        <div className="ai-empty-icon">
          🤖
        </div>

        <h3>
          Start building with AI
        </h3>

        <p>
          Ask VocodeAI to create apps,
          edit files, debug code,
          generate UI, APIs and more.
        </p>
      </div>
    )}

    {messages.map((m, i) => (
      <div
        key={i}
        className={`msg ${m.role}`}
      >
        {typeof m.content === "string"
          ? m.content
          : m.content?.message ||
            JSON.stringify(m.content)}
      </div>
    ))}

    <div ref={messagesEndRef} />

  </div>

</div>

      {/* ========================================= */}
      {/* MESSAGES                                  */}
      {/* ========================================= */}

      <div ref={messagesEndRef} className="ai-messages">

        {messages.length === 0 && (
          <div className="ai-empty">
            <div className="ai-empty-icon">
              🤖
            </div>

            <h3>
              Start building with AI
            </h3>

            <p>
              Ask VocodeAI to create apps,
              edit files, debug code, generate
              UI, APIs and more.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg ${m.role}`}
          >
            {typeof m.content === "string"
              ? m.content
              : m.content?.message ||
                JSON.stringify(m.content)}
          </div>
        ))}

      </div>

      {/* ========================================= */}
      {/* INPUT AREA                                */}
      {/* ========================================= */}

      <div className="ai-input">

        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Ask VocodeAI..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <VoiceInput
          onCommand={(cmd) =>
            sendMessage(cmd, workspaceId)
          }
        />

        <button onClick={handleSend}>
          Send
        </button>

      </div>

      {/* ========================================= */}
      {/* LOADING                                   */}
      {/* ========================================= */}

      {loading && (
        <div className="ai-loading">
          <div className="ai-loader"></div>
          VocodeAI is thinking...
        </div>
      )}

    </div>
  );
}