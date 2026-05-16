import fs from "fs";
import path from "path";

const WORKSPACES_ROOT = path.join(process.cwd(), "workspaces");

/* ================= HELPERS ================= */

function safeJoin(base, target) {
  const targetPath = path.resolve(base, target);
  if (!targetPath.startsWith(base)) {
    throw new Error("Invalid path");
  }
  return targetPath;
}

export function ensureWorkspace(userId, workspaceId) {
  const wsPath = path.join(WORKSPACES_ROOT, userId, workspaceId);
  if (!fs.existsSync(wsPath)) {
    fs.mkdirSync(wsPath, { recursive: true });
  }
  return wsPath;
}

/* ================= CREATE ================= */

export function createFile(userId, workspaceId, relativePath) {
  const wsPath = ensureWorkspace(userId, workspaceId);
  const fullPath = safeJoin(wsPath, relativePath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  if (!fs.existsSync(fullPath)) fs.writeFileSync(fullPath, "");
}

export function createFolder(userId, workspaceId, relativePath) {
  const wsPath = ensureWorkspace(userId, workspaceId);
  const fullPath = safeJoin(wsPath, relativePath);

  fs.mkdirSync(fullPath, { recursive: true });
}

/* ================= READ ================= */

export function readFile(userId, workspaceId, relativePath) {
  const wsPath = ensureWorkspace(userId, workspaceId);
  const fullPath = safeJoin(wsPath, relativePath);

  return fs.existsSync(fullPath)
    ? fs.readFileSync(fullPath, "utf-8")
    : "";
}

/* ================= SAVE ================= */

export function saveFile(userId, workspaceId, relativePath, content) {
  const wsPath = ensureWorkspace(userId, workspaceId);
  const fullPath = safeJoin(wsPath, relativePath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

/* ================= RENAME ================= */

export function renameNode(userId, workspaceId, oldPath, newPath) {
  const wsPath = ensureWorkspace(userId, workspaceId);

  const from = safeJoin(wsPath, oldPath);
  const to = safeJoin(wsPath, newPath);

  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
}

/* ================= DELETE ================= */

export function deleteNode(userId, workspaceId, relativePath) {
  const wsPath = ensureWorkspace(userId, workspaceId);
  const fullPath = safeJoin(wsPath, relativePath);

  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

/* ================= DELETE WORKSPACE ================= */

export function deleteWorkspace(userId, workspaceId) {
  const wsPath = path.join(WORKSPACES_ROOT, userId, workspaceId);

  if (fs.existsSync(wsPath)) {
    fs.rmSync(wsPath, { recursive: true, force: true });
  }
}
