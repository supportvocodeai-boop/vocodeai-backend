import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { getImageForWorkspace } from "../sandbox/imageResolver.js";

export function generateCompose(userId, projectName, project) {
  const services = {};

  for (const svc of project.services) {
    services[svc.name] = {
      image: getImageForWorkspace(),
      working_dir: "/app",
      volumes: [`./${svc.path}:/app`],
      command: svc.run,
      ports: svc.port ? [`${svc.port}:${svc.port}`] : [],
      tty: true,
    };
  }

  const compose = {
    version: "3.9",
    services,
  };

  const projectRoot = path.join(
    "workspaces",
    userId,
    projectName
  );

  const composePath = path.join(projectRoot, "docker-compose.yml");

  fs.writeFileSync(composePath, yaml.dump(compose));

  return composePath;
}
