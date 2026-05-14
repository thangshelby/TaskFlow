import { FaTrash } from "react-icons/fa";
import { formatDate } from "@libs/utils/date";
import { FaDownload } from "react-icons/fa";
import { TbTrashXFilled } from "react-icons/tb";
import { toast } from "react-toastify";
import { Image } from "antd";

const AttachmentCard = ({
  attachment,
  handleDeleteAttachment,
}: {
  attachment: {
    url: string;
    type: string;
    uploadFrom: string;
    created_at: string;
  };
  handleDeleteAttachment: (attachment: string) => void;
}) => {
  const handleDownload = async () => {
    try {
      // Fetch the file
      const response = await fetch(attachment.url);
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from URL or use a default name
      const filename = attachment.url.split("/").pop() || "download";
      link.download = filename;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="group relative flex h-32 w-36 cursor-pointer flex-col rounded-xs shadow-2xl">
      <div className="relative overflow-hidden rounded-t-xs">
        <Image
          src={attachment.url}
          alt="Attachment"
          className="h-22 w-full object-cover transition-all duration-300 group-hover:scale-110"
          preview={{
            mask: (
              <div className="flex h-full w-full items-center justify-center bg-black/40 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-[2px]">
                View
              </div>
            ),
          }}
        />
      </div>

      <div className="flex flex-col p-1">
        <span className="truncate text-xs font-medium text-gray-600">
          {attachment.url}
        </span>
        <span className="truncate text-xs text-gray-600">
          {formatDate(attachment.created_at)}
        </span>
      </div>

      <div className="absolute top-1 right-1 z-50 flex flex-row gap-1 opacity-0 duration-150 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="cursor-pointer rounded-xs bg-white p-1 duration-150 hover:scale-110"
        >
          <FaDownload className="text-[10px] text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (attachment.uploadFrom !== "attachment") {
              toast.info("Cannot delete this attachment");
              return;
            }
            handleDeleteAttachment(attachment.url);
          }}
          className="cursor-pointer rounded-xs bg-white p-1 duration-150 hover:scale-110"
        >
          {attachment.uploadFrom === "attachment" ? (
            <FaTrash className="text-[10px] text-gray-600" />
          ) : (
            <TbTrashXFilled className="text-[10px] text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AttachmentCard;
