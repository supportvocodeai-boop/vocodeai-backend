import FileNode from "../models/FileNode.js";

/* ========== CREATE FILE / FOLDER ========== */

export async function createNode(req, res) {
  try {
    const { workspaceId, path, type } = req.body;

    const existing = await FileNode.findOne({
      workspaceId,
      path,
    });

    if (existing) {
      return res.status(409).json({
        error: "File or folder already exists",
      });
    }

    const node = await FileNode.create({
      workspaceId,
      path,
      type,
      content: type === "file" ? "" : undefined,
    });

    res.json({
      success: true,
      node,
    });

  } catch (err) {
    console.error("CREATE NODE ERROR:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        error: "Duplicate file/folder",
      });
    }

    res.status(500).json({
      error: "Failed to create node",
    });
  }
}

/* ========== READ FILE ========== */

export async function readFile(req, res) {
  try {
    const { workspaceId, path } = req.query;

    const node = await FileNode.findOne({
      workspaceId,
      path,
      type: "file",
    });

    if (!node) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    res.json({
      content: node.content || "",
    });

  } catch (err) {
    console.error("READ FILE ERROR:", err);

    res.status(500).json({
      error: "Failed to read file",
    });
  }
}

/* ========== SAVE FILE ========== */

export async function saveFile(req, res) {
  try {
    const { workspaceId, path, content } = req.body;

    const node = await FileNode.findOneAndUpdate(
      {
        workspaceId,
        path,
        type: "file",
      },
      {
        content,
      },
      {
        new: true,
      }
    );

    if (!node) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    res.json({
      success: true,
    });

  } catch (err) {
    console.error("SAVE FILE ERROR:", err);

    res.status(500).json({
      error: "Failed to save file",
    });
  }
}

/* ========== RENAME FILE / FOLDER ========== */

export async function renameNode(req, res) {
  try {
    const { workspaceId, oldPath, newPath } = req.body;

    const escapedOldPath = oldPath.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const nodes = await FileNode.find({
      workspaceId,
      path: {
        $regex: `^${escapedOldPath}`,
      },
    });

    for (const node of nodes) {
      const updatedPath = node.path.replace(
        oldPath,
        newPath
      );

      await FileNode.updateOne(
        { _id: node._id },
        { path: updatedPath }
      );
    }

    res.json({
      success: true,
    });

  } catch (err) {
    console.error("RENAME NODE ERROR:", err);

    res.status(500).json({
      error: "Rename failed",
    });
  }
}

/* ========== DELETE FILE / FOLDER ========== */

export async function deleteNode(req, res) {
  try {
    const { workspaceId, path } = req.body;

    const escapedPath = path.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    await FileNode.deleteMany({
      workspaceId,
      path: {
        $regex: `^${escapedPath}`,
      },
    });

    res.json({
      success: true,
    });

  } catch (err) {
    console.error("DELETE NODE ERROR:", err);

    res.status(500).json({
      error: "Delete failed",
    });
  }
}

/* ========== LOAD TREE ========== */

export async function loadTree(req, res) {
  try {
    const nodes = await FileNode.find({
      workspaceId: req.query.workspaceId,
    }).sort({
      path: 1,
    });

    res.json(nodes);

  } catch (err) {
    console.error("LOAD TREE ERROR:", err);

    res.status(500).json({
      error: "Failed to load tree",
    });
  }
}