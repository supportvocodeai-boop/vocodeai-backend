import * as fileService from "../services/fileService.js";
import { execInWorkspace } from "../sandbox/execService.js";

export async function executeAI({
  userId,
  workspaceId,
  workspacePath,
  command,
}) {
  switch (command.action) {
    case "create_file":
      fileService.createFile(userId, workspaceId, command.path);

      if (command.content) {
        fileService.saveFile(
          userId,
          workspaceId,
          command.path,
          command.content
        );
      }

      return { message: "File created" };

    case "write_file":
      fileService.saveFile(
        userId,
        workspaceId,
        command.path,
        command.content
      );
      return { message: "File updated" };

    case "run_code":
    case "terminal":
      return await execInWorkspace({
        userId,
        workspaceId,
        workspacePath,
        command: command.command,
      });

    case "chat":
      return { message: command.message };

    default:
      return { message: "Unknown command" };
  }
}