export function parseAI(response) {
  try {
    return JSON.parse(response);
  } catch {
    return {
      action: "chat",
      message: response,
    };
  }
}