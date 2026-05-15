import pty from "node-pty";

export function createDockerPty(containerId) {
  return pty.spawn(
    "docker",
    ["exec", "-it", containerId, "bash"],
    {
      name: "xterm-256color",
      cols: 120,
      rows: 30,
      cwd: process.cwd(),
      env: {
        ...process.env,
        TERM: "xterm-256color",
      },
    }
  );
}