import "../../styles/terminal.css";

import { useWorkspace } from "../../context/WorkspaceContext";

import {
  FiSquare,
  FiRefreshCw,
  FiTrash2,
  FiX,
  FiPlus,
} from "react-icons/fi";

export default function TerminalTabs() {
  const {
    terminals,
    activeTerminal,
    setActiveTerminal,
    killTerminal,
    openNewTerminal,
    socketRef,
  } = useWorkspace();

  if (!terminals.length) return null;

  /* ====================================== */
  /* SEND */
  /* ====================================== */

  const send = (payload) => {
    if (
      socketRef.current?.readyState ===
      WebSocket.OPEN
    ) {
      socketRef.current.send(
        JSON.stringify(payload)
      );
    }
  };

  /* ====================================== */
  /* ACTIONS */
  /* ====================================== */

  const stopProcess = (id) => {
    send({
      type: "input",
      terminalId: id,
      data: "\x03",
    });
  };

  const restartTerminal = (id) => {
    send({
      type: "restart",
      terminalId: id,
    });
  };

  const clearTerminal = (id) => {
    send({
      type: "clear",
      terminalId: id,
    });
  };

  const closeAll = () => {
    terminals.forEach((t) =>
      killTerminal(t.id)
    );
  };

  return (
    <div className="terminal-header">
      {/* ====================================== */}
      {/* TABS */}
      {/* ====================================== */}

      <div className="terminal-tabs">
        {terminals.map((t, i) => (
          <div
            key={t.id}
            className={`terminal-tab ${
              activeTerminal === t.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTerminal(t.id)
            }
          >
            <span className="dot" />

            <span className="title">
              Terminal {i + 1}
            </span>

            <div className="actions">
              <FiSquare
                title="Stop"
                onClick={(e) => {
                  e.stopPropagation();
                  stopProcess(t.id);
                }}
              />

              <FiRefreshCw
                title="Restart"
                onClick={(e) => {
                  e.stopPropagation();
                  restartTerminal(t.id);
                }}
              />

              <FiTrash2
                title="Clear"
                onClick={(e) => {
                  e.stopPropagation();
                  clearTerminal(t.id);
                }}
              />

              <FiX
                className="close"
                title="Close"
                onClick={(e) => {
                  e.stopPropagation();
                  killTerminal(t.id);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ====================================== */}
      {/* RIGHT */}
      {/* ====================================== */}

      <div className="terminal-right">
        <button
          className="new-btn"
          onClick={openNewTerminal}
        >
          <FiPlus />
          <span>New</span>
        </button>

        {/* STOP ACTIVE */}
        <button
          className="icon-btn"
          onClick={() =>
            stopProcess(activeTerminal)
          }
        >
          <FiSquare />
        </button>

        {/* CLEAR ACTIVE */}
        <button
          className="icon-btn"
          onClick={() =>
            clearTerminal(activeTerminal)
          }
        >
          <FiTrash2 />
        </button>

        {/* CLOSE ALL */}
        <button
          className="icon-btn danger"
          onClick={closeAll}
        >
          <FiX />
        </button>
      </div>
    </div>
  );
}