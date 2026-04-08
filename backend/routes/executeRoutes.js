import express from "express";
import path from "path";
import { auth } from "../middleware/auth.js";
import { codeQueue } from "../queue/codeQueue.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { workspaceId, command } = req.body;

    const workspacePath = path.join(
      process.cwd(),
      "workspaces",
      req.user.id,
      workspaceId
    );

    const job = await codeQueue.add("run-code", {
      userId: req.user.id,
      workspaceId,
      workspacePath,
      command,
    });

    res.json({
      jobId: job.id,
      status: "queued",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;