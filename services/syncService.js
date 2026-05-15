import fs from "fs";
import path from "path";
import FileNode from "../models/FileNode.js";

export async function syncWorkspaceToDB(userId, workspaceId) {
  const workspacePath = path.join(
    process.cwd(),
    "workspaces",
    userId,
    workspaceId
  );

  if (!fs.existsSync(workspacePath)) return;

  const nodes = [];

  function walk(dir, base = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = base
        ? `${base}/${entry.name}`
        : entry.name;

      if (entry.isDirectory()) {
        nodes.push({
          workspaceId,
          path: relativePath,
          type: "folder",
        });

        walk(fullPath, relativePath);
      } else {
        nodes.push({
          workspaceId,
          path: relativePath,
          type: "file",
        });
      }
    }
  }

  walk(workspacePath);

  // Replace DB records in optimized way
  await FileNode.deleteMany({ workspaceId });

  if (nodes.length > 0) {
    await FileNode.insertMany(nodes);
  }
}