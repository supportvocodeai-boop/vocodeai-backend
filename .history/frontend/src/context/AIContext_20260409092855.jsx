import { createContext, useContext, useState } from "react";
import { askAI } from "../services/aiApi";
import { useAuth } from "./AuthContext";
import { useWorkspace } from "./WorkspaceContext";

const AIContext = createContext();

export function AIProvider({ children }) {
  const { accessToken } = useAuth();
  const {
    openFile,
    updateContent,
    addFile,
    runCode,
    openNewTerminal,
  } = useWorkspace();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text, workspaceId) => {
    setLoading(true);

    try {
      const res = await askAI(accessToken, text, workspaceId);

      const ai = res.ai;
      const result = res.result;

      /* ================= APPLY AI ACTION ================= */

      if (ai.action === "create_file") {
        await addFile("", ai.path);
        await openFile(ai.path);
        updateContent(ai.path, ai.content || "");
      }

      if (ai.action === "write_file") {
        await openFile(ai.path);
        updateContent(ai.path, ai.content || "");
      }

      if (ai.action === "run_code" || ai.action === "terminal") {
        openNewTerminal();
        setTimeout(() => {
          runCode();   
        }, 300);
      }

      /* ================= CHAT ================= */

      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        { role: "assistant", content: JSON.stringify(ai, null, 2) },
      ]);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <AIContext.Provider value={{ sendMessage, messages, loading }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);