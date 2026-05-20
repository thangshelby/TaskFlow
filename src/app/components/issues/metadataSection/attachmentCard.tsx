import { useState } from "react";
import { formatDate } from "@libs/utils/date";
import { FaTrash, FaDownload, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileAlt, FaFileCode, FaFileArchive, FaFile, FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { TbTrashXFilled } from "react-icons/tb";
import { toast } from "react-toastify";
import { Image } from "antd";

interface Attachment {
  url: string;
  name?: string;
  type: string;
  size?: number;
  uploadFrom: string;
  created_at: string;
}

function getDocumentIcon(mimeType: string) {
  if (mimeType.includes("pdf"))
    return { Icon: FaFilePdf, color: "#e74c3c", label: "PDF" };
  if (mimeType.includes("word") || mimeType.includes("docx") || mimeType.includes("doc"))
    return { Icon: FaFileWord, color: "#2980b9", label: "DOC" };
  if (mimeType.includes("sheet") || mimeType.includes("excel") || mimeType.includes("xlsx") || mimeType.includes("xls"))
    return { Icon: FaFileExcel, color: "#27ae60", label: "XLS" };
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint") || mimeType.includes("pptx") || mimeType.includes("ppt"))
    return { Icon: FaFilePowerpoint, color: "#e67e22", label: "PPT" };
  if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("rar") || mimeType.includes("7z"))
    return { Icon: FaFileArchive, color: "#8e44ad", label: "ZIP" };
  if (mimeType.includes("json") || mimeType.includes("xml") || mimeType.includes("html") || mimeType.includes("javascript") || mimeType.includes("typescript"))
    return { Icon: FaFileCode, color: "#16a085", label: "CODE" };
  if (mimeType.includes("text"))
    return { Icon: FaFileAlt, color: "#7f8c8d", label: "TXT" };
  return { Icon: FaFile, color: "#95a5a6", label: "FILE" };
}


const AttachmentCard = ({
  attachment,
  handleDeleteAttachment,
}: {
  attachment: Attachment;
  handleDeleteAttachment: (attachment: string) => void;
}) => {
  const isImage = attachment.type.startsWith("image/");
  const [confirming, setConfirming] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.name || attachment.url.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not download file");
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (attachment.uploadFrom !== "attachment") {
      toast.info("Cannot delete this attachment");
      return;
    }
    setConfirming(true);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDeleteAttachment(attachment.url);
    setConfirming(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirming(false);
  };

  // ── Action buttons (idle state) ───────────────────────────
  const ActionButtons = () => (
    <div className="absolute top-1 right-1 z-50 flex flex-row gap-1 opacity-0 duration-150 group-hover:opacity-100">
      <button
        onClick={(e) => { e.stopPropagation(); handleDownload(); }}
        className="cursor-pointer rounded bg-white/90 p-1.5 shadow-sm duration-150 hover:scale-110 hover:bg-white"
        title="Download"
      >
        <FaDownload className="text-[10px] text-gray-500" />
      </button>
      <button
        onClick={handleDeleteClick}
        className="cursor-pointer rounded bg-white/90 p-1.5 shadow-sm duration-150 hover:scale-110 hover:bg-white"
        title="Delete"
      >
        {attachment.uploadFrom === "attachment"
          ? <FaTrash className="text-[10px] text-gray-500" />
          : <TbTrashXFilled className="text-[10px] text-gray-500" />
        }
      </button>
    </div>
  );

  // ── Confirm buttons (replaces action buttons) ─────────────
  const ConfirmButtons = () => (
    <div
      className="absolute top-1 right-1 z-50 flex flex-row items-center gap-1 rounded-md bg-white p-1 shadow-md border border-[#064e3b]/10 animate-in fade-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="px-1.5 text-[10px] font-bold text-[#064e3b] uppercase tracking-wider">
        Confirm
      </span>
      <button
        onClick={handleConfirm}
        className="flex h-6 w-6 items-center justify-center rounded bg-red-500 text-white shadow-sm transition-all duration-150 hover:scale-105 hover:bg-red-600 active:scale-95"
        title="Yes, delete"
      >
        <FaCheck size={10} />
      </button>
      <button
        onClick={handleCancel}
        className="flex h-6 w-6 items-center justify-center rounded bg-[#064e3b]/10 text-[#064e3b] shadow-sm transition-all duration-150 hover:scale-105 hover:bg-[#064e3b]/20 active:scale-95"
        title="Cancel"
      >
        <IoClose size={12} />
      </button>
    </div>
  );

  const { Icon, color, label } = getDocumentIcon(attachment.type);

  return (
    <div className="group relative flex h-32 w-36 cursor-pointer flex-col overflow-hidden rounded-lg border border-[#064e3b]/15 bg-white shadow-sm transition-all duration-150 hover:shadow-md hover:border-[#064e3b]/30">
      {/* ── Preview Area (Top) ── */}
      <div className="relative flex h-[55%] w-full items-center justify-center overflow-hidden bg-gray-50/80">
        {isImage ? (
          <Image
            src={attachment.url}
            alt={attachment.name || "Attachment"}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
            preview={{
              mask: (
                <div className="flex h-full w-full items-center justify-center bg-black/40 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-[2px]">
                  View
                </div>
              ),
            }}
          />
        ) : (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg shadow-sm"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            <Icon size={24} />
          </div>
        )}
      </div>

      {/* ── Info Area (Bottom) ── */}
      <div className="flex flex-1 flex-col justify-center border-t border-[#064e3b]/5 px-2.5 py-1.5">
        <span
          className="truncate text-[11px] font-semibold text-[#064e3b]/90"
          title={attachment.name || label}
        >
          {attachment.name || label}
        </span>
        <span className="mt-0.5 text-[9px] text-[#064e3b]/50">
          {formatDate(attachment.created_at)}
        </span>
      </div>

      {confirming ? <ConfirmButtons /> : <ActionButtons />}
    </div>
  );
};

export default AttachmentCard;
