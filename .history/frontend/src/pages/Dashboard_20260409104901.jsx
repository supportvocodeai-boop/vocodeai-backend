import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  listWorkspaces,
  createWorkspace,
  deleteWorkspace,
  renameWorkspace,
  duplicateWorkspace,
  pinWorkspace,
} from "../services/workspaceApi";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { accessToken, loading } = useAuth();
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");

  const [showSearch, setShowSearch] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [menuOpen, setMenuOpen] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const searchRef = useRef(null);
  const createRef = useRef(null);

  /* ================= LOAD WORKSPACES ================= */
  useEffect(() => {
    if (loading) return;
    if (!accessToken) return;

    const load = async () => {
      try {
        const data = await listWorkspaces(accessToken);
        setWorkspaces(data);
      } catch (err) {
        console.error("Failed to load workspaces", err);
      }
    };

    load();
  }, [accessToken, loading]);

  /* ================= FOCUS HANDLING ================= */
  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
    if (showCreate) createRef.current?.focus();
  }, [showSearch, showCreate]);

  const filtered = workspaces.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CREATE WORKSPACE ================= */
  const create = async () => {
    if (!newName.trim()) return;

    try {
      console.log("Creating workspace...");

      const ws = await createWorkspace(accessToken, newName.trim());

      console.log("Created:", ws);

      setNewName("");
      setShowCreate(false);

      navigate(`/workspace/${ws._id}`);
    } catch (err) {
      console.error("CREATE WORKSPACE ERROR:", err);
      alert("Failed to create workspace");
    }
  };

  /* ================= RENAME ================= */
  const submitRename = async (ws) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }

    try {
      const updated = await renameWorkspace(
        accessToken,
        ws._id,
        renameValue
      );

      setWorkspaces((p) =>
        p.map((w) => (w._id === ws._id ? updated : w))
      );

      setRenamingId(null);
    } catch (err) {
      console.error("Rename failed", err);
    }
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <img src="/Nlogo.png" className="logo" alt="Vocodeai" />

        <div className="actions">
          {/* SEARCH */}
          {!showSearch ? (
            <button
              className="icon-btn"
              onClick={() => setShowSearch(true)}
            >
              🔍
            </button>
          ) : (
            <input
              ref={searchRef}
              className="search-input"
              placeholder="Search workspaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => setShowSearch(false)}
            />
          )}

          {/* CREATE */}
          {!showCreate ? (
            <button
              className="create-pill"
              onClick={() => setShowCreate(true)}
            >
              + Create Workspace
            </button>
          ) : (
            <div className="create-inline">
              <input
                ref={createRef}
                placeholder="Workspace name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && create()}
                onBlur={() => {
                  // ✅ only close if empty (prevents accidental cancel)
                  if (!newName.trim()) setShowCreate(false);
                }}
              />

              <button
                onMouseDown={(e) => e.preventDefault()} // ✅ prevents blur cancel
                onClick={create}
              >
                Create
              </button>
            </div>
          )}
        </div>
      </header>

      {/* GRID */}
      <section className="workspace-grid">
        {filtered.map((ws) => (
          <div key={ws._id} className="workspace-card">
            <div
              className="card-main"
              onClick={() => navigate(`/workspace/${ws._id}`)}
            >
              <span className="folder">📁</span>

              {renamingId === ws._id ? (
                <input
                  className="rename-input"
                  autoFocus
                  value={renameValue}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => submitRename(ws)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && submitRename(ws)
                  }
                />
              ) : (
                <span className="name">{ws.name}</span>
              )}

              {ws.isPinned && <span className="pin">⭐</span>}
            </div>

            {/* MENU */}
            <div className="card-menu">
              <button
                className="kebab"
                onClick={() =>
                  setMenuOpen(menuOpen === ws._id ? null : ws._id)
                }
              >
                ⋮
              </button>

              {menuOpen === ws._id && (
                <div className="dropdown">
                  <div
                    onClick={() => {
                      setRenamingId(ws._id);
                      setRenameValue(ws.name);
                      setMenuOpen(null);
                    }}
                  >
                    ✏️ Rename
                  </div>

                  <div
                    onClick={async () => {
                      const copy = await duplicateWorkspace(
                        accessToken,
                        ws._id
                      );
                      setWorkspaces((p) => [copy, ...p]);
                      setMenuOpen(null);
                    }}
                  >
                    📋 Duplicate
                  </div>

                  <div
                    onClick={async () => {
                      const updated = await pinWorkspace(
                        accessToken,
                        ws._id,
                        !ws.isPinned
                      );
                      setWorkspaces((p) =>
                        p.map((w) =>
                          w._id === ws._id ? updated : w
                        )
                      );
                      setMenuOpen(null);
                    }}
                  >
                    ⭐ {ws.isPinned ? "Unpin" : "Pin"}
                  </div>

                  <div
                    className="danger"
                    onClick={async () => {
                      await deleteWorkspace(accessToken, ws._id);
                      setWorkspaces((p) =>
                        p.filter((w) => w._id !== ws._id)
                      );
                    }}
                  >
                    🗑 Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}