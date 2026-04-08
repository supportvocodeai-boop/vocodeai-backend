import Workspace from "../models/Workspace.js";
import FileNode from "../models/FileNode.js";
import { ensureWorkspace, deleteWorkspace as deleteWorkspaceFS } from "../services/fileService.js";

/* CREATE */
export async function createWorkspace(req, res) {
  const ws = await Workspace.create({
    userId: req.user.id,
    name: req.body.name,
  });

  ensureWorkspace(req.user.id, ws._id.toString());
  res.json(ws);
}

/* LIST */
export async function listWorkspaces(req, res) {
  const workspaces = await Workspace.find({ userId: req.user.id }).sort({
    isPinned: -1,
    createdAt: -1,
  });
  res.json(workspaces);
}

/* DELETE */
export async function deleteWorkspace(req, res) {
  try {
    // 1️⃣ Delete workspace from MongoDB
    const workspace = await Workspace.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // 2️⃣ Delete all files/folders from MongoDB
    await FileNode.deleteMany({
      workspaceId: workspace._id,
    });

    // 3️⃣ Delete workspace folder from filesystem
    deleteWorkspaceFS(req.user.id, workspace._id.toString());

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE WORKSPACE ERROR:", err);
    res.status(500).json({ error: "Failed to delete workspace" });
  }
}

/* RENAME */
export async function renameWorkspace(req, res) {
  const ws = await Workspace.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { name: req.body.name },
    { new: true }
  );

  if (!ws) return res.status(404).json({ error: "Not found" });
  res.json(ws);
}

/* DUPLICATE (unchanged) */
export async function duplicateWorkspace(req, res) {
  const old = await Workspace.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!old) return res.status(404).json({ error: "Not found" });

  const copy = await Workspace.create({
    userId: req.user.id,
    name: `${old.name} (copy)`,
  });

  ensureWorkspace(req.user.id, copy._id.toString());
  res.json(copy);
}

/* PIN / UNPIN */
export async function togglePin(req, res) {
  const ws = await Workspace.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { isPinned: req.body.isPinned },
    { new: true }
  );

  if (!ws) return res.status(404).json({ error: "Not found" });
  res.json(ws);
}
