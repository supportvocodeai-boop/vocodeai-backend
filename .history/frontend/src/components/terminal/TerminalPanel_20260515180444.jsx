import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import "xterm/css/xterm.css";

import { useWorkspace } from "../../context/WorkspaceContext";

export default function TerminalPanel({
  terminalId,
}) {
  const { socketRef } = useWorkspace();

  const containerRef = useRef(null);

  const termRef = useRef(null);

  const fitAddonRef = useRef(null);

  useEffect(() => {
    if (!terminalId || !socketRef.current)
      return;

    const term = new Terminal({
      theme: {
        background: "#000000",
        foreground: "#ffffff",

        cursor: "#00ffa6",

        selectionBackground:
          "rgba(0,255,166,0.3)",
      },

      fontSize:
        window.innerWidth < 768 ? 12 : 14,

      cursorBlink: true,

      scrollback: 3000,

      convertEol: true,

      fontFamily:
        "'Fira Code', monospace",
    });

    const fitAddon = new FitAddon();

    term.loadAddon(fitAddon);

    term.open(containerRef.current);

    fitAddon.fit();

    term.focus();

    termRef.current = term;

    fitAddonRef.current = fitAddon;

    /* ====================================== */
    /* INPUT */
    /* ====================================== */

    term.onData((data) => {
      socketRef.current.send(
        JSON.stringify({
          type: "input",
          terminalId,
          data,
        })
      );
    });

    /* ====================================== */
    /* OUTPUT */
    /* ====================================== */

    const outputHandler = (e) => {
      if (
        e.detail.terminalId === terminalId ||
        e.detail.terminalId === "runtime"
      ) {
        term.write(e.detail.data);
      }
    };

    window.addEventListener(
      "terminal-output",
      outputHandler
    );

    /* ====================================== */
    /* RESIZE */
    /* ====================================== */

    const resizeHandler = () => {
      setTimeout(() => {
        fitAddon.fit();
      }, 100);
    };

    window.addEventListener(
      "resize",
      resizeHandler
    );

    /* ====================================== */
    /* CLEANUP */
    /* ====================================== */

    return () => {
      window.removeEventListener(
        "terminal-output",
        outputHandler
      );

      window.removeEventListener(
        "resize",
        resizeHandler
      );

      term.dispose();
    };
  }, [terminalId]);

  return (
    <div className="terminal-panel">
      <div
        ref={containerRef}
        className="xterm-container"
      />
    </div>
  );
}