import FileNode from "../models/FileNode.js";
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

      /* ========================================= */
      /* CREATE FILE                               */
      /* ========================================= */

      case "create_file":

        await FileNode.findOneAndUpdate(
          {
            workspaceId,
            path: cmd.path,
          },
          {
            workspaceId,
            path: cmd.path,
            type: "file",
            content: cmd.content || "",
          },
          {
            upsert: true,
            new: true,
          }
        );

        results.push(`Created ${cmd.path}`);

        break;

      /* ========================================= */
      /* WRITE FILE                                */
      /* ========================================= */

      case "write_file":

        await FileNode.findOneAndUpdate(
          {
            workspaceId,
            path: cmd.path,
            type: "file",
          },
          {
            content: cmd.content || "",
          },
          {
            new: true,
            upsert: true,
          }
        );

        results.push(`Updated ${cmd.path}`);

        break;

      /* ========================================= */
      /* RUN CODE                                  */
      /* ========================================= */

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

      /* ========================================= */
      /* CHAT                                      */
      /* ========================================= */

      case "chat":

        results.push(cmd.message);

        break;

      /* ========================================= */
      /* UNKNOWN                                   */
      /* ========================================= */

      default:

        results.push(
          `Unknown action: ${cmd.action}`
        );
    }
  }

  return { results };
}