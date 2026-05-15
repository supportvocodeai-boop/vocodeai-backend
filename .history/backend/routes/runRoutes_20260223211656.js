import express from "express";
import path from "path";
import { auth } from "../middleware/auth.js";
import { detectProject } from "../projects/projectDetector.js";
import { codeQueue } from "../queue/codeQueue.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { workspaceId } = req.body;

    const workspacePath = path.join(
      process.cwd(),
      "workspaces",
      req.user.id,
      workspaceId
    );

    const detected = detectProject(workspacePath);

    if (!detected) {
      return res.status(400).json({
        error: "No supported project detected",
      });
    }

    const job = await codeQueue.add("run-project", {
      userId: req.user.id,
      workspaceId,
      workspacePath,
      command: detected.command,
      mode: detected.mode,
    });

    res.json({
      jobId: job.id,
      type: detected.type,
      port: detected.port || null,
      workspaceId,
    });

  } catch (err) {
    res.status(500).json({ error: "Run failed" });
  }
});

export default router;