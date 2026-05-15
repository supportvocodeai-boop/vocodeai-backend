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

    if (!workspaceId || !command) {
      return res.status(400).json({
        error: "Missing fields",
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
    // CREATE TEMP DIRECTORY
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
        "utf-8"
      );

      console.log(
        "WRITTEN:",
        filePath
      );

      console.log(
        "CONTENT:",
        file.content
      );
    }

    // =========================
    // EXECUTE
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
    });

  } catch (err) {
    console.error("EXECUTE ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};