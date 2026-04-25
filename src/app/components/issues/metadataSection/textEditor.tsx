import { useEffect, useRef, useState, useCallback } from "react";
import Quill, { Delta } from "quill";
import "quill/dist/quill.snow.css";
import { uploadFileToCloudinary } from "@libs/utils/file";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { useSpeechToText } from "@libs/hooks/common/useSpeechToText";
import { FaMicrophone, FaStop } from "react-icons/fa";

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
    <div className="flex w-full flex-col gap-2">
      {/* Speech to text control above editor */}
      <div className="flex items-center gap-2">
        <p className="py-1 text-sm font-bold text-gray-600">Description</p>
        {isSpeechSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`stt-mic-btn cursor-pointer ${isListening ? "stt-mic-btn--active" : ""}`}
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
          <span className="stt-status-badge">
            <span className="stt-pulse" />
            Listening...
          </span>
        )}
      </div>

      <div
        className={`rounded border transition-colors ${isListening
          ? "border-red-400 shadow-[0_0_0_2px_rgba(248,113,113,0.2)]"
          : "border-gray-300 focus-within:border-emerald-500"
          }`}
      >
        <div ref={editorRef} />
      </div>

      {isListening && interimText && (
        <div className="stt-interim-preview">
          <span className="stt-interim-text">{interimText}</span>
        </div>
      )}

      <div className="flex flex-row gap-2 mt-2">
        <button
          onClick={handleSaveDescription}
          disabled={isSaving}
          className="flex items-center gap-2 cursor-pointer rounded-sm bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Saving...</span>
            </>
          ) : (
            "Save"
          )}
        </button>
        <button
          onClick={handleClose}
          disabled={isSaving}
          className="cursor-pointer rounded-sm bg-transparent px-[10px] py-1 text-sm font-medium text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
