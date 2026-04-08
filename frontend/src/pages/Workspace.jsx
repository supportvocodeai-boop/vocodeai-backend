import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { WorkspaceProvider, useWorkspace } from "../context/WorkspaceContext";
import { useEffect, useState, useRef } from "react";
import { getWorkspace } from "../services/workspaceApi";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/navbar";
import EditorTabs from "../components/editor/EditorTabs";
import CodeEditor from "../components/editor/CodeEditor";
import RunBar from "../components/editor/RunBar";
import TerminalTabs from "../components/terminal/TerminalTabs";
import TerminalPanel from "../components/terminal/TerminalPanel";
import LivePreview from "../components/preview/LivePreview";

import "../styles/workspace.css";

/* ================= INNER LAYOUT ================= */

function WorkspaceLayout() {
  const {
  terminals,
  activeTerminal,
  setActiveTerminal,
  killTerminal,
  previewUrl,
  activeFile   // ✅ ADD THIS
} = useWorkspace();


  /* ---------- RESIZABLE SIDEBAR ---------- */
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const resizingSidebar = useRef(false);

  const startSidebarResize = () => {
    resizingSidebar.current = true;
  };

  const resizeSidebar = (e) => {
    if (!resizingSidebar.current) return;
    setSidebarWidth((w) =>
      Math.min(Math.max(w + e.movementX, 180), 420)
    );
  };

  const stopSidebarResize = () => {
    resizingSidebar.current = false;
  };

  /* ---------- RESIZABLE TERMINAL ---------- */
  const [terminalHeight, setTerminalHeight] = useState(240);
  const resizingTerminal = useRef(false);

  const startTerminalResize = () => {
    resizingTerminal.current = true;
  };

  const resizeTerminal = (e) => {
    if (!resizingTerminal.current) return;
    setTerminalHeight((h) =>
      Math.min(Math.max(h - e.movementY, 120), 500)
    );
  };

  const stopTerminalResize = () => {
    resizingTerminal.current = false;
  };

  const showTerminal = terminals.length > 0;

  return (
    <>
      <Navbar />

      <div
        className="workspace"
        onMouseMove={(e) => {
          resizeSidebar(e);
          resizeTerminal(e);
        }}
        onMouseUp={() => {
          stopSidebarResize();
          stopTerminalResize();
        }}
        onMouseLeave={() => {
          stopSidebarResize();
          stopTerminalResize();
        }}
      >
        {/* ---------- SIDEBAR ---------- */}
        <div
          className="sidebar-wrapper"
          style={{ width: sidebarWidth }}
        >
          <Sidebar />
          <div
            className="sidebar-resizer"
            onMouseDown={startSidebarResize}
          />
        </div>

        {/* ---------- MAIN AREA ---------- */}
        <div className="workspace-main">
          <RunBar />
          <EditorTabs />

          <div className="editor-area">
            <CodeEditor />
          </div>

          <LivePreview url={previewUrl} activeFile={activeFile} />



          {/* ---------- TERMINAL ---------- */}
          {showTerminal && (
            <div
              className="terminal-section"
              style={{ height: terminalHeight }}
            >
              <div
                className="terminal-resizer"
                onMouseDown={startTerminalResize}
              />

              <TerminalTabs
                terminals={terminals}
                activeTerminal={activeTerminal}
                setActiveTerminal={setActiveTerminal}
                closeTerminal={killTerminal}
              />

              {activeTerminal && (
                <TerminalPanel terminalId={activeTerminal} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ================= WORKSPACE META LOADER ================= */

function WorkspaceLoader({ workspaceId, accessToken }) {
  const { setCurrentWorkspace } = useWorkspace();

  useEffect(() => {
    if (!workspaceId || !accessToken) return;

    getWorkspace(accessToken, workspaceId)
      .then(setCurrentWorkspace)
      .catch(() => setCurrentWorkspace(null));
  }, [workspaceId, accessToken]);

  return null;
}

/* ================= PROVIDER WRAPPER ================= */

export default function Workspace() {
  const { id: workspaceId } = useParams();
  const { user, accessToken, loading } = useAuth();

  if (loading) return null;
  if (!user || !accessToken) return null;
  

  return (
    <WorkspaceProvider userId={user.id} workspaceId={workspaceId}>
      <WorkspaceLoader
        userId={user.id}
        workspaceId={workspaceId}
        accessToken={accessToken}
      />
      <WorkspaceLayout />
    </WorkspaceProvider>
  );
}