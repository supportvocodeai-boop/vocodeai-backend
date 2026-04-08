import User from "../models/User.js";
import Workspace from "../models/Workspace.js";

const startTime = Date.now();

export async function getStats(req, res) {
  const totalUsers = await User.countDocuments();
  const totalWorkspaces = await Workspace.countDocuments();

  const uptime = Math.floor((Date.now() - startTime) / 1000);

  res.json({
    activeUsers: totalUsers,
    totalUsers,
    projectsCreated: totalWorkspaces,
    uptime,
  });
}
