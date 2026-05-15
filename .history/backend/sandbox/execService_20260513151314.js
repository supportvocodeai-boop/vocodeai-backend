import { getOrCreateContainer } from "./containerManager.js";
import { touchContainer } from "./containerRegistry.js";
import Docker from "dockerode";

const docker = new Docker();

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

    Tty: false,

    WorkingDir: "/workspace",
  });

  const stream = await execInstance.start({
    hijack: true,
    stdin: false,
  });

  return new Promise((resolve, reject) => {
    let output = "";

    // ✅ CORRECT DOCKER DEMUX
    container.modem.demuxStream(
      stream,

      {
        write: (chunk) => {
          output += chunk.toString();
        },
      },

      {
        write: (chunk) => {
          output += chunk.toString();
        },
      }
    );

    stream.on("end", async () => {
      const inspectData = await execInstance.inspect();

      resolve({
        output: output.trim(),
        exitCode: inspectData.ExitCode,
      });
    });

    stream.on("error", reject);
  });
}