import fs from "fs/promises";
import path from "path";
import os from "os";

import FileNode from "../models/FileNode.js";
import { execInWorkspace } from "../sandbox/execService.js";

export const executeCode = async (req, res) => {
  try {
    const {
      workspaceId,
      command,
      stdin,
    } = req.body;

    const userId = req.user.id;

    if (!workspaceId || !command) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // =========================
    // LOAD FILES FROM DATABASE
    // =========================

    const files = await FileNode.find({
      workspaceId,
      type: "file",
    });

    // =========================
    // CREATE TEMP WORKSPACE
    // =========================

    const tempDir = path.join(
      os.tmpdir(),
      `workspace_${workspaceId}`
    );

    await fs.mkdir(tempDir, {
      recursive: true,
    });

    // =========================
    // WRITE FILES TO DISK
    // =========================

    for (const file of files) {
      const fullPath = path.join(
        tempDir,
        file.path
      );

      const dir = path.dirname(fullPath);

      await fs.mkdir(dir, {
        recursive: true,
      });

      await fs.writeFile(
        fullPath,
        file.content || "",
        "utf-8"
      );
    }

    // =========================
    // EXECUTE
    // =========================

    const result = await execInWorkspace({
      userId,
      workspaceId,
      workspacePath: tempDir,
      command,
      stdin,
    });

    res.json(result);

  } catch (err) {
    console.error("EXECUTE ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};