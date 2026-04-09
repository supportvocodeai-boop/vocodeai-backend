import {
  FaFolder,
  FaFolderOpen,
  FaNodeJs,
  FaFileAlt,
  FaJs,
} from "react-icons/fa";
import { SiNpm } from "react-icons/si";

export function getFileIcon(name, type, isOpen = false) {
  // Folder
  if (type === "folder") {
    if (name === "node_modules") return <FaNodeJs color="#8CC84B" />;
    return isOpen ? <FaFolderOpen /> : <FaFolder />;
  }

  // Special files
  if (name === "package.json") return <SiNpm color="#CB3837" />;
  if (name === "package-lock.json") return <SiNpm color="#CB3837" />;

  // Extensions
  if (name.endsWith(".js")) return <FaJs color="#F7DF1E" />;
  if (name.endsWith(".json")) return <FaFileAlt color="#fbc02d" />;

  return <FaFileAlt />;
}