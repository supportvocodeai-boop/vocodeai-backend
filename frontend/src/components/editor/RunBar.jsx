import { useWorkspace } from "../../context/WorkspaceContext";
import "../../styles/editor.css";

export default function RunBar() {
  const {
    runCode,
    runProject,
    activeFile,
    refreshPreview,
    saveActiveFile,
    dirtyFiles,
  } = useWorkspace();

  const isProject = !activeFile;
  const isHTML = activeFile?.endsWith(".html");
  const isDirty = activeFile && dirtyFiles.has(activeFile);

  const ext = activeFile?.split(".").pop();


  const handleRun = () => {
    if (isProject) {
      runProject();
    } else if (isHTML) {
      refreshPreview();
    } else {
      runCode();
    }
  };

  return (
    <div className="run-bar">
      <div className="run-bar-left">
        <span
          className={`lang-badge ${isProject ? "project" : ""}`}
          style={!isProject && meta.color ? { background: meta.color } : {}}
        >
          {isProject
            ? "Project"
            : isHTML
            ? "HTML"
            : meta.label || "Text"}
        </span>
      </div>

      <div className="run-bar-right">
        <button className="run-btn" onClick={handleRun}>
          ▶{" "}
          {isProject
            ? "Run Project"
            : isHTML
            ? "Preview HTML"
            : "Run File"}
        </button>
      </div>
    </div>
  );
}
