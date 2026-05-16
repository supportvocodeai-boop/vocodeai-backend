import * as fileService from "../services/fileService.js";
import { execInWorkspace } from "../sandbox/execService.js";

export async function executeAI({
  userId,
  workspaceId,
  workspacePath,
  command,
}) {
  const results = [];

  for (const cmd of command.actions) {
    switch (cmd.action) {
      case "create_file":
        await FileNode.create({
          workspaceId,
          path: cmd.path,
          type: "file",
          content: cmd.content || "",
        });

        if (cmd.content) {
          fileService.saveFile(
            userId,
            workspaceId,
            cmd.path,
            cmd.content
          );
        }

        results.push(`Created ${cmd.path}`);
        break;

      case "write_file":
        results.push(`Updated ${cmd.path}`);
        break;

      case "run_code":
      case "terminal":
        const output = await execInWorkspace({
          userId,
          workspaceId,
          workspacePath,
          command: cmd.command,
        });
        results.push(output);
        break;

      case "chat":
        results.push(cmd.message);
        break;

      default:
        results.push("Unknown command");
    }
  }

  return { results };
}