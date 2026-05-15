import fs from "fs";
import path from "path";

/**
 * Load project.json from workspace
 */
export function loadProject(userId, projectName) {
  const projectPath = path.join(
    process.cwd(),
    "workspaces",
    userId,
    projectName,
    "project.json"
  );

  if (!fs.existsSync(projectPath)) {
    throw new Error("project.json not found");
  }

  return JSON.parse(fs.readFileSync(projectPath, "utf-8"));
}

/**
 * Validate project services (NO workspace creation here)
 */
export function ensureProjectServices(userId, projectName) {
  const project = loadProject(userId, projectName);

  // ✅ Just validate paths exist
  for (const service of project.services) {
    const servicePath = path.join(
      process.cwd(),
      "workspaces",
      userId,
      projectName,
      service.path
    );

    if (!fs.existsSync(servicePath)) {
      throw new Error(`Service path not found: ${service.path}`);
    }
  }

  return project;
}
