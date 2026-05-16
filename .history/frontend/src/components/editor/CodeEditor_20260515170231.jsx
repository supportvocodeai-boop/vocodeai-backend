import Editor from "@monaco-editor/react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useRef, useMemo } from "react";
import "../../styles/editor.css";

export default function CodeEditor() {
  const {
    activeFile,
    fileContents,
    updateContent,
  } = useWorkspace();

  const editorRef = useRef(null);

  /* ===================================================== */
  /* EMPTY STATE */
  /* ===================================================== */

  if (!activeFile) {
    return (
      <div className="editor-empty">
        Open a file to start coding
      </div>
    );
  }

  /* ===================================================== */
  /* LANGUAGE */
  /* ===================================================== */

  const ext = activeFile.split(".").pop();

  const languageMap = {
    py: "python",
    js: "javascript",
    ts: "typescript",
    jsx: "javascript",
    tsx: "typescript",
    java: "java",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    c: "c",
    html: "html",
    css: "css",
    json: "json",
  };

  const language =
    languageMap[ext] || "plaintext";

  /* ===================================================== */
  /* RESPONSIVE OPTIONS */
  /* ===================================================== */

  const editorOptions = useMemo(() => {
    const isMobile = window.innerWidth < 768;

    return {
      fontSize: isMobile ? 13 : 14,

      minimap: {
        enabled: false,
      },

      automaticLayout: true,

      wordWrap: "on",

      scrollBeyondLastLine: false,

      smoothScrolling: true,

      cursorBlinking: "smooth",

      cursorSmoothCaretAnimation: "on",

      padding: {
        top: 12,
      },

      lineNumbers: isMobile ? "off" : "on",

      glyphMargin: false,

      folding: !isMobile,

      lineDecorationsWidth: isMobile ? 8 : 12,

      lineNumbersMinChars: isMobile ? 0 : 4,

      overviewRulerBorder: false,

      hideCursorInOverviewRuler: true,

      scrollbar: {
        verticalScrollbarSize: isMobile ? 8 : 10,
        horizontalScrollbarSize: isMobile
          ? 8
          : 10,
      },

      suggestFontSize: isMobile ? 12 : 14,

      quickSuggestions: true,

      tabSize: 2,

      renderWhitespace: "selection",

      bracketPairColorization: {
        enabled: true,
      },
    };
  }, []);

  return (
    <div className="editor-area">
      <Editor
        key={activeFile}
        theme="vs-dark"
        language={language}
        value={fileContents[activeFile] || ""}
        height="100%"
        options={editorOptions}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(value) => {
          updateContent(activeFile, value || "");
        }}
      />
    </div>
  );
}