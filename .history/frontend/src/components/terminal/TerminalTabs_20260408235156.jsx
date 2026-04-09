import "../../styles/terminal.css";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function TerminalTabs() {
  const {
    terminals,
    activeTerminal,
    setActiveTerminal,
    killTerminal,
    socketRef,
  } = useWorkspace();

  if (!terminals.length) return null;

  const send = (payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  };

  const stopProcess = (terminalId) => {
    send({
      type: "input",
      terminalId,
      data: "\x03",
    });
  };

  const restartTerminal = (terminalId) => {
    send({
      type: "restart",
      terminalId,
    });
  };

  const clearTerminal = (terminalId) => {
    send({
      type: "clear",
      terminalId,
    });
  };

  return (
    <div className="terminal-tabs">
      {terminals.map((t, i) => (
        <div
          key={t.id}
          className={`terminal-tab ${
            activeTerminal === t.id ? "active" : ""
          }`}
          onClick={() => setActiveTerminal(t.id)}
        >
          <span className="terminal-title">
            Terminal {i + 1}
          </span>

          <div className="terminal-actions">
            <button
              title="Stop"
              onClick={(e) => {
                e.stopPropagation();
                stopProcess(t.id);
              }}
            >
              🛑
            </button>

            <button
              title="Restart"
              onClick={(e) => {
                e.stopPropagation();
                restartTerminal(t.id);
              }}
            >
              🔄
            </button>

            <button
              title="Clear"
              onClick={(e) => {
                e.stopPropagation();
                clearTerminal(t.id);
              }}
            >
              🧹
            </button>

            <button
              title="Kill"
              className="kill-btn"
              onClick={(e) => {
                e.stopPropagation();
                killTerminal(t.id);
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}