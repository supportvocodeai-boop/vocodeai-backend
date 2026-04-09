import path from "path";
import { exec } from "child_process";
import { loadProject } from "./projectManager.js";
import { generateCompose } from "./composeGenerator.js";

export function runProject(userId, projectName) {
  const project = loadProject(userId, projectName);

  const composePath = generateCompose(
    userId,
    projectName,
    project
  );

  const cwd = path.dirname(composePath);

  exec("docker compose up -d", { cwd }, (err) => {
    if (err) {
      console.error("Compose failed", err);
    }
  });

  return project.services
    .filter(s => s.port)
    .map(s => ({
      service: s.name,
      port: s.port,
      url: `http://localhost:${s.port}`,
    }));
}
