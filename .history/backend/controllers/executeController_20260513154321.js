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

    // =========================
    // LOAD FILES
    // =========================

    const files = await FileNode.find({
      workspaceId,
      type: "file",
    });

    // =========================
    // TEMP WORKSPACE
    // =========================

    const tempDir = path.join(
      os.tmpdir(),
      `workspace_${workspaceId}`
    );

    await fs.rm(tempDir, {
      recursive: true,
      force: true,
    });

    await fs.mkdir(tempDir, {
      recursive: true,
    });

    // =========================
    // WRITE FILES
    // =========================

    for (const file of files) {
      const filePath = path.join(
        tempDir,
        file.path
      );

      const dir = path.dirname(filePath);

      await fs.mkdir(dir, {
        recursive: true,
      });

      await fs.writeFile(
        filePath,
        file.content || "",
        "utf8"
      );
    }

    // =========================
    // DIRECT EXECUTION
    // =========================

    const result = await execInWorkspace({
      userId: req.user.id,
      workspaceId,
      workspacePath: tempDir,
      command,
      stdin,
    });

    console.log("EXEC RESULT:", result);

    res.json({
      success: true,
      output: result.output || "",
      error: result.error || "",
    });

  } catch (err) {
    console.error("EXEC ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};