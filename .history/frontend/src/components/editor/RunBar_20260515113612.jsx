import { useState } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import "../../styles/editor.css";

export default function RunBar() {
  const {
    runCode,
    runProject,
    activeFile,
    refreshPreview,
  } = useWorkspace();

  const [isRunning, setIsRunning] = useState(false);

  const isProject = !activeFile;
  const isHTML = activeFile?.endsWith(".html");

  const ext = activeFile?.split(".").pop();

  const languageMap = {
    py: { label: "PYTHON", color: "#3776AB" },
    js: { label: "JAVASCRIPT", color: "#f7df1e" },
    ts: { label: "TYPESCRIPT", color: "#3178c6" },
    jsx: { label: "REACT", color: "#61dafb" },
    tsx: { label: "REACT", color: "#61dafb" },
    java: { label: "JAVA", color: "#f89820" },
    cpp: { label: "C++", color: "#00599C" },
    cc: { label: "C++", color: "#00599C" },
    cxx: { label: "C++", color: "#00599C" },
    html: { label: "HTML", color: "#e34c26" },
    css: { label: "CSS", color: "#264de4" },
    json: { label: "JSON", color: "#f5f5f5" },
  };

  const meta = ext ? languageMap[ext] || {} : {};

  const handleRun = async () => {
    /* ========================================= */
    /* BLOCK SPAM CLICKS                         */
    /* ========================================= */

    if (isRunning) return;

    try {
      setIsRunning(true);

      if (isProject) {
        await runProject();

      } else if (isHTML) {
        await refreshPreview();

      } else {
        await runCode();
      }

    } catch (err) {
      console.error("RUN ERROR:", err);

    } finally {
      setTimeout(() => {
        setIsRunning(false);
      }, 1500);
    }
  };

  return (
    <div className="run-bar">

      <div className="run-bar-left">
        <span
          className="lang-badge"
          style={
            !isProject && meta.color
              ? { background: meta.color }
              : {}
          }
        >
          {isProject
            ? "PROJECT"
            : meta.label || "TEXT"}
        </span>
      </div>

      <div className="run-bar-right">

        <button
          className={`run-btn ${
            isRunning ? "running" : ""
          }`}
          onClick={handleRun}
          disabled={isRunning}
        >
          {isRunning
            ? "⏳ Running..."
            : isProject
            ? "▶ Run Project"
            : isHTML
            ? "👁 Preview"
            : "▶ Run File"}
        </button>

      </div>
    </div>
  );
}