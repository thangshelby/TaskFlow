import { useEffect, useRef, useState, useCallback } from "react";
import Quill, { Delta } from "quill";
import "quill/dist/quill.snow.css";
import { uploadFileToCloudinary } from "@libs/utils/file";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { useSpeechToText } from "@libs/hooks/common/useSpeechToText";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { Image } from "antd";

export default function TextEditor({
  initialDeltaString,
  issueId,
  projectId,
  attachments,
  handleClose,
}: {
  initialDeltaString: string;
  issueId: string;
  projectId: string;
  attachments: string[];
  handleClose: () => void;
}) {
  const editorRef = useRef(null);
  const quillRef = useRef<Quill | null>(null);
  const [initialAttachmentsOps, setInitialAttachmentsOps] = useState<string[]>(
    attachments.map((attachment) => JSON.parse(attachment).url),
  );

  const { updateIssueAsync } = useUpdateIssue({ projectId });
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        const src = (target as HTMLImageElement).src;
        setPreviewImage(src);
        setPreviewOpen(true);
      }
    };

    const editorRoot = quillRef.current?.root;
    if (editorRoot) {
      editorRoot.addEventListener("click", handleImageClick);
    }

    return () => {
      if (editorRoot) {
        editorRoot.removeEventListener("click", handleImageClick);
      }
    };
  }, [quillRef.current]);

  useEffect(() => {
    const toolbarOptions = [
      [
        "bold",
        "italic",
        "underline",
        "strike",
        "link",
        "image",
        "video",
        { list: "ordered" },
        { list: "bullet" },
      ],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["clean"],
    ];

    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });

      try {
        if (initialDeltaString) {
          const delta = JSON.parse(initialDeltaString).delta;
          quillRef.current.setContents(delta);

          const imageOps = delta.ops
            .filter((op: any) => op.insert?.image)
            .map((op: any) => op.insert.image);
          setInitialAttachmentsOps(imageOps);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [initialDeltaString]);

  const handleSaveDescription = async () => {
    if (!quillRef.current || isSaving) return;

    try {
      setIsSaving(true);
      const rawDelta: Delta = quillRef.current.getContents();
      const { delta, updatedAttachments } = await handleProcessDelta(rawDelta);

      const plainText = quillRef.current.getText();

      const description = {
        plainText,
        delta,
      };
      await updateIssueAsync({
        id: issueId,
        data: {
          description: JSON.stringify(description),
          attachments: updatedAttachments,
        },
      });
      handleClose();
    } catch (error) {
      console.error("Failed to save description:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProcessDelta = async (
    rawDelta: Delta,
  ): Promise<{
    delta: Delta;
    updatedAttachments: string[];
  }> => {
    // Extract current image operations
    const currentImageOps = rawDelta.ops
      .filter(
        (op: any) => typeof op.insert === "object" && "image" in op.insert,
      )
      .map((op: any) => op.insert.image);

    const deletedImages = initialAttachmentsOps.filter(
      (image) => !currentImageOps.includes(image),
    );

    // Filter out deleted attachments
    let updatedAttachments = [...attachments].filter((attachment) => {
      const { url } = JSON.parse(attachment);
      return !deletedImages.includes(url);
    });

    // Handle new images
    const newAttachments = [];
    for (const op of rawDelta.ops) {
      if (typeof op.insert === "object" && "image" in op.insert) {
        const image = op.insert as { image: string };
        if (!initialAttachmentsOps.includes(image.image)) {
          // Upload new image to Cloudinary
          const imageUrl = await uploadFileToCloudinary(image.image, undefined);
          op.insert = { image: imageUrl };
          newAttachments.push(
            JSON.stringify({
              url: imageUrl,
              type: "image",
              uploadFrom: "description",
              created_at: new Date().toISOString(),
            }),
          );
        }
      }
    }

    if (newAttachments.length > 0) {
      updatedAttachments = [...attachments, ...newAttachments];
    }

    return {
      delta: rawDelta,
      updatedAttachments,
    };
  };

  const handleSpeechResult = useCallback((finalText: string) => {
    if (!quillRef.current) return;
    const length = quillRef.current.getLength();
    quillRef.current.insertText(length > 0 ? length - 1 : 0, finalText + " ");
    quillRef.current.setSelection(quillRef.current.getLength() - 1, 0);
  }, []);

  const {
    isListening,
    interimText,
    isSupported: isSpeechSupported,
    toggleListening,
  } = useSpeechToText({
    lang: "en-US",
    continuous: true,
    interimResults: true,
    onResult: handleSpeechResult,
  });

  return (
    <div className="flex w-full flex-col gap-2 p-4">
      {/* Speech to text control above editor */}
      <div className="flex items-center gap-2">
        <p className="text-[11px] font-black uppercase tracking-widest text-[#064e3b]/60">Description</p>
        {isSpeechSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`stt-mic-btn cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${isListening ? "stt-mic-btn--active bg-red-100 text-red-500!" : "text-[#064e3b]/40 hover:text-[#064e3b]"}`}
            title={isListening ? "Stop dictation" : "Start dictation"}
          >
            {isListening ? (
              <FaStop className="stt-mic-icon" />
            ) : (
              <FaMicrophone className="stt-mic-icon" />
            )}
          </button>
        )}
        {isListening && (
          <span className="stt-status-badge animate-pulse bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            Listening...
          </span>
        )}
      </div>

      <div
        className={`rounded-md border transition-all duration-300 ${isListening
          ? "border-red-400 shadow-[0_0_0_2px_rgba(248,113,113,0.1)]"
          : "border-[#064e3b]/10 focus-within:border-[#064e3b]/30 focus-within:ring-2 focus-within:ring-[#064e3b]/5"
          } bg-[#fcfcfb]/30 overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-gray-50/50 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[180px] [&_.ql-editor]:text-[14px] [&_.ql-editor]:font-manrope`}
      >
        <div ref={editorRef} />
      </div>

      {isListening && interimText && (
        <div className="stt-interim-preview bg-gray-50 border-l-2 border-red-400 p-2 rounded-r-md">
          <span className="stt-interim-text text-sm text-gray-500 italic">{interimText}</span>
        </div>
      )}

      <div className="flex flex-row items-center gap-3 mt-1">
        <button
          onClick={handleSaveDescription}
          disabled={isSaving}
          className="flex items-center gap-2 cursor-pointer rounded-md bg-[#064e3b] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#053d2e] hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isSaving ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save</span>
            </>
          )}
        </button>
        <button
          onClick={handleClose}
          disabled={isSaving}
          className="cursor-pointer rounded-md bg-transparent px-4 py-2 text-sm font-bold text-[#064e3b]/60 transition-all hover:bg-[#064e3b]/5 hover:text-[#064e3b] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
      
      {/* Hidden Image for Preview */}
      {previewImage && (
        <div className="hidden">
          <Image
            src={previewImage}
            preview={{
              visible: previewOpen,
              onVisibleChange: (value) => setPreviewOpen(value),
              src: previewImage,
            }}
          />
        </div>
      )}
    </div>
  );
}
