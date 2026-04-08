import { getAllContainers } from "./containerRegistry.js";
import { stopAndRemoveContainer } from "./containerManager.js";

const IDLE_TIMEOUT =
  Number(process.env.CONTAINER_IDLE_TIMEOUT) ||
  15 * 60 * 1000;

export function startContainerReaper() {
  setInterval(async () => {
    const now = Date.now();

    for (const [workspaceId, entry] of getAllContainers()) {
      if (now - entry.lastUsed > IDLE_TIMEOUT) {
        console.log(`[REAPER] Stopping idle container: ${workspaceId}`);
        await stopAndRemoveContainer(workspaceId);
      }
    }
  }, 60 * 1000);
}
