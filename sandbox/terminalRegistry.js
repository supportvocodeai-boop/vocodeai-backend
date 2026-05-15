const terminalMap = new Map();

export function registerTerminal(id, data) {
  terminalMap.set(id, data);
}

export function getTerminal(id) {
  return terminalMap.get(id);
}

export function removeTerminal(id) {
  terminalMap.delete(id);
}

export function getAllTerminals() {
  return terminalMap;
}