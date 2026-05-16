import { getOrCreateContainer } from "./containerManager.js";
import { touchContainer } from "./containerRegistry.js";

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

  const stream = await execInstance.start({
    hijack: true,
    stdin: false,
  });

  return new Promise((resolve, reject) => {
    let output = "";

    stream.on("data", (chunk) => {
      // Remove docker multiplex header
      const cleaned = chunk.slice(8).toString();

      output += cleaned;
    });

    stream.on("end", () => {
      resolve({
        output: output.trim(),
      });
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}