import Workspace from "../models/Workspace.js";
import FileNode from "../models/FileNode.js";

/* CREATE */
export async function createWorkspace(req, res) {
  try {
    const ws = await Workspace.create({
      userId: req.user.id,
      name: req.body.name,
    });

    res.json(ws);

  } catch (err) {
    console.error("CREATE WORKSPACE ERROR:", err);

    res.status(500).json({
      error: "Failed to create workspace",
    });
  }
}

/* LIST */
export async function listWorkspaces(req, res) {
  try {
    const workspaces = await Workspace.find({
      userId: req.user.id,
    }).sort({
      isPinned: -1,
      createdAt: -1,
    });

    res.json(workspaces);

  } catch (err) {
    console.error("LIST WORKSPACE ERROR:", err);

    res.status(500).json({
      error: "Failed to load workspaces",
    });
  }
}

/* DELETE */
export async function deleteWorkspace(req, res) {
  try {
    // Delete workspace
    const workspace = await Workspace.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!workspace) {
      return res.status(404).json({
        error: "Workspace not found",
      });
    }

    // Delete all nodes
    await FileNode.deleteMany({
      workspaceId: workspace._id,
    });

    res.json({
      success: true,
    });

  } catch (err) {
    console.error("DELETE WORKSPACE ERROR:", err);

    res.status(500).json({
      error: "Failed to delete workspace",
    });
  }
}

/* RENAME */
export async function renameWorkspace(req, res) {
  try {
    const ws = await Workspace.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        name: req.body.name,
      },
      {
        new: true,
      }
    );

    if (!ws) {
      return res.status(404).json({
        error: "Workspace not found",
      });
    }

    res.json(ws);

  } catch (err) {
    console.error("RENAME WORKSPACE ERROR:", err);

    res.status(500).json({
      error: "Failed to rename workspace",
    });
  }
}

/* DUPLICATE */
export async function duplicateWorkspace(req, res) {
  try {
    const old = await Workspace.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!old) {
      return res.status(404).json({
        error: "Workspace not found",
      });
    }

    const copy = await Workspace.create({
      userId: req.user.id,
      name: `${old.name} (copy)`,
    });

    // Duplicate files
    const oldNodes = await FileNode.find({
      workspaceId: old._id,
    });

    const copiedNodes = oldNodes.map((node) => ({
      workspaceId: copy._id,
      path: node.path,
      type: node.type,
      content: node.content || "",
    }));

    if (copiedNodes.length > 0) {
      await FileNode.insertMany(copiedNodes);
    }

    res.json(copy);

  } catch (err) {
    console.error("DUPLICATE WORKSPACE ERROR:", err);

    res.status(500).json({
      error: "Failed to duplicate workspace",
    });
  }
}

/* PIN / UNPIN */
export async function togglePin(req, res) {
  try {
    const ws = await Workspace.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        isPinned: req.body.isPinned,
      },
      {
        new: true,
      }
    );

    if (!ws) {
      return res.status(404).json({
        error: "Workspace not found",
      });
    }

    res.json(ws);

  } catch (err) {
    console.error("PIN WORKSPACE ERROR:", err);

    res.status(500).json({
      error: "Failed to update workspace",
    });
  }
}