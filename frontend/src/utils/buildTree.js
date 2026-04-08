export function buildTree(nodes) {
  const root = {
    name: "",
    type: "folder",
    children: [],
  };

  const map = { "": root };

  for (const node of nodes) {
    const parts = node.path.split("/");
    let currentPath = "";

    parts.forEach((part, index) => {
      const parentPath = currentPath;
      currentPath = parentPath ? `${parentPath}/${part}` : part;

      if (!map[currentPath]) {
        map[currentPath] = {
          name: part,
          type: index === parts.length - 1 ? node.type : "folder",
          children: [],
        };

        map[parentPath].children.push(map[currentPath]);
      }
    });
  }

  return root;
}
