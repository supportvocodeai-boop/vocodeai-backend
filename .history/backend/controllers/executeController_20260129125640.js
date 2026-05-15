import { execInWorkspace } from "../sandbox/execService.js";
import path from "path";

export const executeCode = async (req, res) => {
  try {
    const { userId, workspaceId, command, stdin } = req.body;

    if (!userId || !workspaceId || !command) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const workspacePath = path.join(
      process.cwd(),
      "workspaces",
      userId,
      workspaceId
    );

    const result = await execInWorkspace({
      workspaceId,
      workspacePath,
      command,
      stdin,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
