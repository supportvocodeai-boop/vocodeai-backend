import "../../styles/editor.css";

export default function EditorFooter({ language = "PYTHON" }) {
  return (
    <div className="editor-footer">
      <div className="footer-left">
        VocodeAI Editor v1.0 &nbsp;&nbsp; UTF-8
      </div>

      <div className="footer-right">
        Ln 1, Col 1 &nbsp;&nbsp; {language}
      </div>
    </div>
  );
}