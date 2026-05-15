import Docker from "dockerode";
import { getImageForWorkspace } from "./imageResolver.js";

import {
  registerContainer,
  getContainerEntry,
  touchContainer,
  removeContainer,
} from "./containerRegistry.js";

const docker = new Docker();

export async function getOrCreateContainer({
  workspaceKey,
  workspacePath,
}) {
  const existing = getContainerEntry(workspaceKey);

  // =========================
  // REMOVE OLD CONTAINER
  // =========================

 if (existing) {
  touchContainer(workspaceKey);
  return existing.container;
}

  // =========================
  // CREATE NEW CONTAINER
  // =========================

  const image = getImageForWorkspace();

  console.log(
    "MOUNTING WORKSPACE:",
    workspacePath
  );

  const container = await docker.createContainer({
    Image: image,

    Tty: true,
    OpenStdin: true,

    WorkingDir: "/workspace",

    HostConfig: {
      Binds: [
        `${workspacePath}:/workspace`,
      ],

      Memory: 1024 * 1024 * 512,

      CpuShares: 512,

      PidsLimit: 256,
    },
  });

  await container.start();

  registerContainer(workspaceKey, container);

  touchContainer(workspaceKey);

  return container;
}

export async function stopAndRemoveContainer(
  workspaceKey
) {
  const entry = getContainerEntry(workspaceKey);

  if (!entry) return;

  try {
    await entry.container.stop({
      t: 5,
    });
  } catch {}

  try {
    await entry.container.remove({
      force: true,
    });
  } catch {}

  removeContainer(workspaceKey);
}