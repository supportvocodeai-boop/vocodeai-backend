import { useWorkspace } from "../../context/WorkspaceContext";
import "../../styles/editor.css";
export default function EditorTabs() {
  const { openTabs, activeFile, openFile, closeTab, dirtyFiles } =
    useWorkspace();

  return (
    <div className="tabs-bar">
      {openTabs.map((file) => (
        <div
          key={file}
          className={`tab ${activeFile === file ? "active" : ""}`}
          onClick={() => openFile(file)}
        >
          {file}
          {dirtyFiles.has(file) && <span className="dirty-dot">●</span>}
          <span
            className="close"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(file);
            }}
          >
            ✕
          </span>
        </div>
      ))}
    </div>
  );
}
