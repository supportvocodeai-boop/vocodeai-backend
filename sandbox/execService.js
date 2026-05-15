import { getOrCreateContainer } from "./containerManager.js";
import { touchContainer } from "./containerRegistry.js";

function getContainerKey(userId, workspaceId) {
  return `${userId}-${workspaceId}`;
}

export async function execInWorkspace({
  userId,
  workspaceId,
  workspacePath,
  command,
  detach = false,
}) {
  const key = `${userId}-${workspaceId}`;

  const container = await getOrCreateContainer({
    workspaceKey: key,
    workspacePath,
  });

  touchContainer(key);

  const execInstance = await container.exec({
    Cmd: ["bash", "-lc", command],
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    WorkingDir: "/workspace",
  });

  if (detach) {
    await execInstance.start({ hijack: true, stdin: false });
    return { started: true };
  }

  const stream = await execInstance.start({
    hijack: true,
    stdin: false,
  });

  return new Promise((resolve, reject) => {
    let output = "";

    stream.on("data", (chunk) => {
      output += chunk.toString();
    });

    stream.on("end", () => {
      resolve({ output });
    });

    stream.on("error", reject);
  });
}
