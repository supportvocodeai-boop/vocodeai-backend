import fs from "fs";
import path from "path";
import FileNode from "../models/FileNode.js";

export async function syncWorkspaceToDB(userId, workspaceId) {
  try {
    const workspacePath = path.join(
      process.cwd(),
      "workspaces",
      userId,
      workspaceId
    );

    if (!fs.existsSync(workspacePath)) return;

    const nodes = [];

    async function walk(dir, base = "") {
      const entries = fs.readdirSync(dir, {
        withFileTypes: true,
      });

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

          await walk(fullPath, relativePath);
        } else {
          let content = "";

          try {
            content = fs.readFileSync(fullPath, "utf-8");
          } catch {
            content = "";
          }

          nodes.push({
            workspaceId,
            path: relativePath,
            type: "file",
            content,
          });
        }
      }
    }

    await walk(workspacePath);

    // UPSERT INSTEAD OF DELETE ALL
    for (const node of nodes) {
      await FileNode.findOneAndUpdate(
        {
          workspaceId: node.workspaceId,
          path: node.path,
        },
        node,
        {
          upsert: true,
          new: true,
        }
      );
    }

  } catch (err) {
    console.error("SYNC ERROR:", err);
  }
}