const backendUrl = import.meta.env.VITE_BACKEND_URL;
export async function execute({ userId, workspaceId, command }) {
  await fetch(`${backendUrl}/api/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, workspaceId, command }),
  });
}
