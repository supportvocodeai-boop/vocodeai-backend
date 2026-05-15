import { WebSocketServer } from "ws";
import path from "path";
import jwt from "jsonwebtoken";

import { getOrCreateContainer } from "./sandbox/containerManager.js";
import { touchContainer } from "./sandbox/containerRegistry.js";
import { createDockerPty } from "./terminal/dockerPty.js";
import { hydrateWorkspace } from "./services/hydrateWorkspace.js";

import {
  registerTerminal,
  getTerminal,
  removeTerminal,
  getAllTerminals,
} from "./sandbox/terminalRegistry.js";

function getContainerKey(userId, workspaceId) {
  return `${userId}-${workspaceId}`;
}

export function setupTerminalServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    /* ========================================= */
    /* AUTH                                      */
    /* ========================================= */

    const params = new URLSearchParams(req.url.replace("/?", ""));

    const token = params.get("token");

    let userId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      userId = decoded.id;
    } catch {
      ws.close();
      return;
    }

    /* ========================================= */
    /* MESSAGE HANDLER                           */
    /* ========================================= */

    ws.on("message", async (raw) => {
      let msg;

      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      /* ========================================= */
      /* CREATE TERMINAL                           */
      /* ========================================= */
      const terminalCount = [...getAllTerminals().values()].filter(
        (t) => t.userId === userId,
      ).length;

      if (terminalCount >= 5) {
        ws.send(
          JSON.stringify({
            type: "error",
            error: "Too many terminals open",
          }),
        );

        return;
      }
      if (msg.type === "create") {
        try {
          const { terminalId, workspaceId } = msg;

          if (!terminalId || !workspaceId) {
            return;
          }

          const workspacePath = path.join(
            process.cwd(),
            process.env.WORKSPACES_ROOT || "workspaces",
            userId,
            workspaceId,
          );

          /* ========================================= */
          /* HYDRATE FROM MONGODB                      */
          /* ========================================= */

          await hydrateWorkspace(userId, workspaceId);

          /* ========================================= */
          /* CONTAINER                                 */
          /* ========================================= */

          const key = getContainerKey(userId, workspaceId);

          const container = await getOrCreateContainer({
            workspaceKey: key,
            workspacePath,
          });

          touchContainer(key);

          /* ========================================= */
          /* PTY                                       */
          /* ========================================= */

          const ptyProcess = createDockerPty(container.id);

          registerTerminal(terminalId, {
            pty: ptyProcess,
            workspaceId,
            userId,
            buffer: "",
          });

          /* ========================================= */
          /* OUTPUT                                    */
          /* ========================================= */

          ptyProcess.onData((data) => {
            const entry = getTerminal(terminalId);

            if (entry) {
              entry.buffer += data;
            }

            ws.send(
              JSON.stringify({
                type: "output",
                terminalId,
                data,
              }),
            );
          });

          /* ========================================= */
          /* EXIT                                      */
          /* ========================================= */

          ptyProcess.onExit(() => {
            removeTerminal(terminalId);

            ws.send(
              JSON.stringify({
                type: "closed",
                terminalId,
              }),
            );
          });

          /* ========================================= */
          /* CREATED                                   */
          /* ========================================= */

          ws.send(
            JSON.stringify({
              type: "created",
              terminalId,
              title: `terminal-${terminalId.slice(0, 4)}`,
            }),
          );
        } catch (err) {
          console.error("TERMINAL CREATE ERROR:", err);

          ws.send(
            JSON.stringify({
              type: "error",
              error: err.message,
            }),
          );
        }
      }

      /* ========================================= */
      /* ATTACH                                     */
      /* ========================================= */

      if (msg.type === "attach") {
        const entry = getTerminal(msg.terminalId);

        if (!entry) {
          return;
        }

        ws.send(
          JSON.stringify({
            type: "output",
            terminalId: msg.terminalId,
            data: entry.buffer,
          }),
        );
      }

      /* ========================================= */
      /* INPUT                                      */
      /* ========================================= */

      if (msg.type === "input") {
        const entry = getTerminal(msg.terminalId);

        if (!entry) {
          return;
        }

        const command = msg.data.trim();

        if (command === "cls") {
          entry.buffer = "";

          ws.send(
            JSON.stringify({
              type: "output",
              terminalId: msg.terminalId,
              data: "\x1Bc",
            }),
          );

          return;
        }

        entry.pty.write(msg.data);
      }

      /* ========================================= */
      /* RESIZE                                     */
      /* ========================================= */

      if (msg.type === "resize") {
        const entry = getTerminal(msg.terminalId);

        if (entry) {
          entry.pty.resize(msg.cols, msg.rows);
        }
      }

      /* ========================================= */
      /* CLEAR                                      */
      /* ========================================= */

      if (msg.type === "clear") {
        const entry = getTerminal(msg.terminalId);

        if (!entry) {
          return;
        }

        entry.buffer = "";
        entry.pty.write("clear\n");
      }

      /* ========================================= */
      /* RESTART                                    */
      /* ========================================= */

      if (msg.type === "restart") {
        const entry = getTerminal(msg.terminalId);

        if (!entry) {
          return;
        }

        const { workspaceId } = entry;

        entry.pty.kill();

        removeTerminal(msg.terminalId);

        const workspacePath = path.join(
          process.cwd(),
          process.env.WORKSPACES_ROOT || "workspaces",
          userId,
          workspaceId,
        );

        /* ========================================= */
        /* HYDRATE AGAIN                             */
        /* ========================================= */

        await hydrateWorkspace(userId, workspaceId);

        const key = getContainerKey(userId, workspaceId);

        const container = await getOrCreateContainer({
          workspaceKey: key,
          workspacePath,
        });

        const newPty = createDockerPty(container.id);

        registerTerminal(msg.terminalId, {
          pty: newPty,
          workspaceId,
          userId,
          buffer: "",
        });

        newPty.onData((data) => {
          const entry = getTerminal(msg.terminalId);

          if (entry) {
            entry.buffer += data;
          }

          ws.send(
            JSON.stringify({
              type: "output",
              terminalId: msg.terminalId,
              data,
            }),
          );
        });
      }

      /* ========================================= */
      /* KILL                                       */
      /* ========================================= */

      if (msg.type === "kill") {
        const entry = getTerminal(msg.terminalId);

        if (!entry) {
          return;
        }

        entry.pty.kill();

        removeTerminal(msg.terminalId);

        ws.send(
          JSON.stringify({
            type: "closed",
            terminalId: msg.terminalId,
          }),
        );
      }
    });

    /* ========================================= */
    /* SOCKET CLOSE                               */
    /* ========================================= */

    ws.on("close", () => {
      // VS Code behavior:
      // Keep terminals alive
    });
  });
}
