import { FiFilePlus, FiFolderPlus } from "react-icons/fi";
import FileExplorer from "../explorer/FileExplorer";
import { useWorkspace } from "../../context/WorkspaceContext";
import "../../styles/sidebar.css";

export default function Sidebar() {
  const { setCreateRequest, currentWorkspace } = useWorkspace();

  return (
    <aside className="sidebar">
      {/* HEADER */}
      <div className="sidebar-header">
        <span className="sidebar-title">EXPLORER</span>

        <div className="sidebar-header-actions">
          <button
            title="New File"
            onClick={() =>
              setCreateRequest({ type: "file", parent: "" })
            }
          >
            <FiFilePlus />
          </button>

          <button
            title="New Folder"
            onClick={() =>
              setCreateRequest({ type: "folder", parent: "" })
            }
          >
            <FiFolderPlus />
          </button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="workspace-name">
        <span className="workspace-icon">📁</span>
         {currentWorkspace?.name || "Loading..."}
      </div>

      {/* TREE */}
      <div className="sidebar-tree">
        <FileExplorer />
      </div>
    </aside>
  );
}
