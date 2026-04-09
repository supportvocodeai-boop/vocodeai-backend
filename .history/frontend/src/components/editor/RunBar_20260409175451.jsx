import { useEffect, useRef } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { LANGUAGE_META } from "../../config/languages";
import "../../styles/editor.css";

export default function RunBar() {
  const {
    runCode,
    runProject,
    activeFile,
    dirtyFiles,
    files, // ✅ make sure your workspace has this (main file store)
  } = useWorkspace();

  const previewWindowRef = useRef(null);

  const isProject = !activeFile;
  const isHTML = activeFile?.endsWith(".html");

  const ext = activeFile?.split(".").pop();
  const meta = ext ? LANGUAGE_META[ext] || {} : {};

  // ✅ Get correct content (dirty OR saved)
  const getFileContent = () => {
    return (
      dirtyFiles?.[activeFile] ||
      files?.[activeFile]?.content ||
      ""
    );
  };

  const openHTMLPreview = () => {
    const content = getFileContent();

    if (!content) {
      alert("No HTML content found!");
      return;
    }

    if (
      !previewWindowRef.current ||
      previewWindowRef.current.closed
    ) {
      previewWindowRef.current = window.open("", "_blank");
    }

    const previewDoc = previewWindowRef.current.document;

    previewDoc.open();
    previewDoc.write(content);
    previewDoc.close();
  };

  const handleRun = () => {
    if (isProject) {
      runProject();
    } else if (isHTML) {
      openHTMLPreview();
    } else {
      runCode();
    }
  };

  // ✅ Auto-refresh preview when HTML changes
  useEffect(() => {
    if (
      isHTML &&
      previewWindowRef.current &&
      !previewWindowRef.current.closed
    ) {
      const timer = setTimeout(() => {
        openHTMLPreview();
      }, 400); // debounce

      return () => clearTimeout(timer);
    }
  }, [dirtyFiles?.[activeFile]]);

  return (
    <div className="run-bar">
      <div className="run-bar-left">
        <span
          className="lang-badge"
          style={!isProject && meta.color ? { background: meta.color } : {}}
        >
          {isProject
            ? "PROJECT"
            : isHTML
            ? "HTML PREVIEW"
            : meta.label?.toUpperCase() || "TEXT"}
        </span>
      </div>

      <div className="run-bar-right">
        <button className="run-btn" onClick={handleRun}>
          {isProject
            ? "▶ Run Project"
            : isHTML
            ? "👁 Preview"
            : "▶ Run File"}
        </button>
      </div>
    </div>
  );
}