import { getOrCreateContainer } from "./containerManager.js";
import { touchContainer } from "./containerRegistry.js";

export async function execInWorkspace({
  userId,
  workspaceId,
  workspacePath,
  command,
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

    Tty: true,

    WorkingDir: "/workspace",
  });

  const stream = await execInstance.start({
    hijack: true,
    stdin: false,
  });

  return new Promise((resolve, reject) => {
    let output = "";

    stream.on("data", (chunk) => {
      output += chunk.toString();
    });

    stream.on("end", async () => {
      try {
        const inspectData = await execInstance.inspect();

        resolve({
          output,
          exitCode: inspectData.ExitCode,
        });
      } catch (err) {
        reject(err);
      }
    });

    stream.on("error", reject);
  });
}