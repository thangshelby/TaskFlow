import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

/**
 * A lightweight Quill editor for create flows.
 * Does NOT call updateIssueAsync — instead fires `onChange`
 * with the same stringified format used by TextEditor:
 *   JSON.stringify({ plainText: string, delta: Delta })
 *
 * Exposes `insertText(text)` via ref so external code
 * (e.g. speech-to-text) can append content.
 */

export interface QuillEditorCreateRef {
  insertText: (text: string) => void;
}

interface QuillEditorCreateProps {
  onChange: (value: string) => void;
  placeholder?: string;
}

const QuillEditorCreate = forwardRef<
  QuillEditorCreateRef,
  QuillEditorCreateProps
>(({ onChange, placeholder = "Add a description..." }, ref) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useImperativeHandle(ref, () => ({
    insertText(text: string) {
      if (!quillRef.current) return;
      const length = quillRef.current.getLength();
      // Insert at end (before trailing newline)
      quillRef.current.insertText(length - 1, text);
      // Move cursor to end
      quillRef.current.setSelection(quillRef.current.getLength() - 1, 0);
    },
  }));

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [
              "bold",
              "italic",
              "underline",
              "strike",
              "link",
              { list: "ordered" },
              { list: "bullet" },
            ],
            [{ header: [1, 2, 3, false] }],
            ["clean"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        if (!quillRef.current) return;
        const delta = quillRef.current.getContents();
        const plainText = quillRef.current.getText().trim();

        if (!plainText) {
          onChange("");
          return;
        }

        onChange(
          JSON.stringify({
            plainText,
            delta,
          }),
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full border border-[#064e3b]/10 bg-[#fcfcfb]/30 overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-gray-50/50 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-[14px] [&_.ql-editor]:font-manrope">
      <div ref={editorRef} />
    </div>
  );
});

QuillEditorCreate.displayName = "QuillEditorCreate";

export default QuillEditorCreate;
