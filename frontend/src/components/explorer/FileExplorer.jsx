import { useWorkspace } from "../../context/WorkspaceContext";
import TreeNode from "./TreeNode";

export default function FileExplorer() {
  const { tree, createRequest } = useWorkspace();

  if (!tree) return null;

  return (
    <div className="file-explorer">
      {createRequest && (
        <TreeNode
          node={{
            name: "",
            type: createRequest.type,
            isNew: true,
          }}
          path={createRequest.parent}
        />
      )}

      {tree.children?.map((child) => (
        <TreeNode key={child.name} node={child} path="" />
      ))}
    </div>
  );
}
