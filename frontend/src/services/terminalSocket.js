export function connectTerminal(userId, workspaceId) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const socket = new WebSocket(`${protocol}://${backendUrl}`);

  socket.onopen = () => {
    console.log("Terminal connected");

    socket.send(
      JSON.stringify({
        type: "create",
        userId,
        workspaceId,
      })
    );
  };

  socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("Terminal disconnected");
  };

  return socket;
}