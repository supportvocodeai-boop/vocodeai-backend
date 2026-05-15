import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { execInWorkspace } from "../sandbox/execService.js";
import { syncWorkspaceToDB } from "../services/syncService.js";

new Worker(
  "code-execution",
  async (job) => {
    const { userId, workspaceId, workspacePath, command, mode } = job.data;

    if (mode === "single") {
      const result = await execInWorkspace({
        userId,
        workspaceId,
        workspacePath,
        command,
      });

      await syncWorkspaceToDB(userId, workspaceId);

      return result;
    }

    if (mode === "server") {
      await execInWorkspace({
        userId,
        workspaceId,
        workspacePath,
        command,
        detach: true,
      });

      return { started: true };
    }
  },
  {
    connection: redisConnection,
    concurrency: 3,
  }
);

console.log("🔥 Multi-project worker started");