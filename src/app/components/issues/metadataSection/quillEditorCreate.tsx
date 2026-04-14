import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

/**
 * A lightweight Quill editor for create flows.
 * Does NOT call updateIssueAsync — instead fires `onChange`
 * with the same stringified format used by TextEditor:
 *   JSON.stringify({ plainText: string, delta: Delta })
 */
export default function QuillEditorCreate({
  onChange,
  placeholder = "Add a description...",
}: {
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

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

  return <div ref={editorRef} />;
}
