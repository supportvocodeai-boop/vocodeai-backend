import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function TerminalPanel({ terminalId }) {
  const { socketRef } = useWorkspace();

  const containerRef = useRef(null);
  const termRef = useRef(null);
  const fitRef = useRef(null);

  useEffect(() => {
    if (!terminalId || !socketRef.current) return;

    const term = new Terminal({
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
      fontSize: 14,
      cursorBlink: true,
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(containerRef.current);
    fitAddon.fit();
    term.focus();

    term.onData((data) => {
      socketRef.current.send(
        JSON.stringify({
          type: "input",
          terminalId,
          data,
        })
      );
    });

    const handleResize = () => {
      setTimeout(() => {
        fitAddon.fit();
      }, 50);

      socketRef.current.send(
        JSON.stringify({
          type: "resize",
          terminalId,
          cols: term.cols,
          rows: term.rows,
        })
      );
    };

    window.addEventListener("resize", handleResize);

    const outputHandler = (e) => {
      const msg = e.detail;
      if (msg.terminalId === terminalId) {
        term.write(msg.data);
      }
    };

    window.addEventListener("terminal-output", outputHandler);

    termRef.current = term;
    fitRef.current = fitAddon;

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("terminal-output", outputHandler);
      term.dispose();
    };
  }, [terminalId]);

 return (
  <div className="terminal-panel">
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%" }}
    />
  </div>
);
}