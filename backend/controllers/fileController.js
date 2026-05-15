import FileNode from "../models/FileNode.js";

/* ========== CREATE FILE / FOLDER ========== */
export async function createNode(req, res) {
  try {
    const { workspaceId, path, type } = req.body;

    const exists = await FileNode.findOne({
      workspaceId,
      path,
    });

    if (exists) {
      return res.json({
        success: true,
        node: exists,
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
    console.error(err);

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
    console.error(err);

    res.status(500).json({
      error: "Failed to read file",
    });
  }
}

/* ========== SAVE FILE ========== */
export async function saveFile(req, res) {
  try {
    const { workspaceId, path, content } = req.body;

    if (content.length > 2_000_000) {
      return res.status(400).json({
        error: "File too large",
      });
    }

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
        upsert: true,
      },
    );

    res.json({
      success: true,
      node,
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

    const escapedOldPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const nodes = await FileNode.find({
      workspaceId,
      path: {
        $regex: `^${escapedOldPath}`,
      },
    });

    for (const node of nodes) {
      const updatedPath = node.path.replace(oldPath, newPath);

      await FileNode.updateOne(
        { _id: node._id },
        {
          path: updatedPath,
        },
      );
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Rename failed",
    });
  }
}
/* ========== DELETE FILE / FOLDER ========== */
export async function deleteNode(req, res) {
  try {
    const { workspaceId, path } = req.body;

    await FileNode.deleteMany({
      workspaceId,
      path: {
        $regex: `^${path}`,
      },
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Delete failed",
    });
  }
}

/* ========== LOAD TREE ========== */
export async function loadTree(req, res) {
  const nodes = await FileNode.find({
    workspaceId: req.query.workspaceId,
  }).sort({ path: 1 });

  res.json(nodes);
}
