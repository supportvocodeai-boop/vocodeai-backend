import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function TerminalPanel({ terminalId, active }) {
  const { socketRef } = useWorkspace();

  const containerRef = useRef(null);
  const termRef = useRef(null);
  const fitRef = useRef(null);

  useEffect(() => {
    if (!terminalId || !socketRef.current) return;

    // 🔥 Create terminal only ONCE
    if (!termRef.current) {
      const term = new Terminal({
        theme: {
          background: "#000000",
          foreground: "#ffffff",
        },
        fontSize: 14,
        cursorBlink: true,
        scrollback: 5000,
      });

      const fitAddon = new FitAddon();

      term.loadAddon(fitAddon);

      term.open(containerRef.current);
      fitAddon.fit();
      term.focus();

      termRef.current = term;
      fitRef.current = fitAddon;

      /* 🔥 SEND INPUT */
      term.onData((data) => {
        socketRef.current.send(
          JSON.stringify({
            type: "input",
            terminalId,
            data,
          })
        );
      });

      /* 🔥 ATTACH (restore buffer) */
      socketRef.current.send(
        JSON.stringify({
          type: "attach",
          terminalId,
        })
      );

      /* 🔥 SOCKET LISTENER */
      socketRef.current.addEventListener("message", (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "output" && msg.terminalId === terminalId) {
          term.write(msg.data);
        }

        if (msg.type === "closed" && msg.terminalId === terminalId) {
          term.write("\r\n[Process exited]\r\n");
        }
      });
    }

    /* 🔥 Resize on active */
    if (active && fitRef.current) {
      setTimeout(() => {
        fitRef.current.fit();
        termRef.current.focus();

        socketRef.current.send(
          JSON.stringify({
            type: "resize",
            terminalId,
            cols: termRef.current.cols,
            rows: termRef.current.rows,
          })
        );
      }, 100);
    }
  }, [terminalId, active]);

  return (
    <div
      className="terminal-panel"
      style={{ display: active ? "block" : "none" }} 
    >
      <div ref={containerRef} className="xterm-container" />
    </div>
  );
}