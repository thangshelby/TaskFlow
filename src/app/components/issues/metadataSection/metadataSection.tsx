import React, { lazy, useState, useTransition } from "react";
import { IIssue } from "@libs/types/issue";
import { FaPlus } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import CustomInput from "../../general-components/customInput";
import { useUpload } from "@libs/hooks/apis/useMetadata";
import { useAuthStore } from "@libs/store/useAuthStore";

const AttachmentCard = lazy(() => import("./attachmentCard"));
const TextEditor = lazy(() => import("./textEditor"));

const MetadataSection = ({
  selectedIssue,
  fileInputRef,
  handleUpdateIssue,
}: {
  selectedIssue: IIssue;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleUpdateIssue: (key: string, value: string) => void;
}) => {
  const [, startTransition] = useTransition();
  const [isShowingTextEditor, setIsShowingTextEditor] = useState(false);
  const { updateIssueAsync } = useUpdateIssue({
    projectId: selectedIssue?.project_id || "",
  });

  const userId = useAuthStore((state) => state.user?.id);
  const { upload, isPending } = useUpload();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input để có thể upload cùng file lại nếu cần
    event.target.value = "";

    const fileUrl = await upload({
      project_id: selectedIssue?.project_id || "",
      user_id: userId || "",
      file,
    });

    const newAttachment = {
      url: fileUrl,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadFrom: "attachment",
      created_at: new Date().toISOString(),
    };

    await updateIssueAsync({
      id: selectedIssue!.id,
      data: {
        attachments: [
          ...selectedIssue!.attachments,
          JSON.stringify(newAttachment),
        ],
      },
    });
  };

  const handleDeleteAttachment = async (attachment: string) => {
    await updateIssueAsync({
      id: selectedIssue!.id,
      data: {
        attachments: selectedIssue!.attachments.filter(
          (a) => JSON.parse(a).url !== attachment,
        ),
      },
    });
  };
  return (
    <div className="flex w-full flex-1 flex-col gap-6 font-manrope">
      {/* Summary */}
      <div className="w-full">
        <CustomInput
          field="summary"
          value={selectedIssue?.summary || ""}
          inputType="text"
          handleUpdateIssue={handleUpdateIssue}
          containerClassName="flex items-center w-full justify-between"
          contentClassName="text-2xl font-black! text-[#064e3b] px-0 w-full bg-transparent!"
        />
      </div>

      {/* Description */}
      <div className="flex w-full flex-col items-start gap-3 mt-2">
        {!isShowingTextEditor && (
          <h3 className="text-[11px] font-black text-[#064e3b]/60 uppercase tracking-widest">
            Description
          </h3>
        )}

        {isShowingTextEditor ? (
          <div className="w-full rounded-md border border-[#064e3b]/10 bg-white shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <TextEditor
              initialDeltaString={selectedIssue?.description || ""}
              issueId={selectedIssue?.id || ""}
              projectId={selectedIssue?.project_id || ""}
              attachments={selectedIssue?.attachments || []}
              handleClose={() => {
                setIsShowingTextEditor(false);
              }}
            />
          </div>
        ) : (
          <div
            onClick={() => {
              startTransition(() => {
                setIsShowingTextEditor(true);
              });
            }}
            className="w-full min-h-[100px] rounded-md border border-[#064e3b]/5 bg-[#fcfcfb]/50 p-4 text-[13px] text-[#064e3b]/90 font-medium cursor-pointer hover:bg-white hover:border-[#064e3b]/20 hover:shadow-sm transition-all group"
          >
            {selectedIssue?.description && selectedIssue!.description[0] === "{"
              ? JSON.parse(selectedIssue?.description || "{}")?.plainText || <span className="text-[#064e3b]/40 italic">Add a description...</span>
              : selectedIssue?.description || <span className="text-[#064e3b]/40 italic">Add a description...</span>
            }
          </div>
        )}
      </div>

      {/* Attachments */}
      <div className="flex w-full flex-col gap-4 mt-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <h3 className="text-[11px] font-black text-[#064e3b]/60 uppercase tracking-widest">
              Attachments
            </h3>
            {selectedIssue!.attachments.length > 0 && (
              <span className="flex h-5 items-center justify-center rounded-md bg-[#064e3b]/10 px-2 text-[10px] font-black text-[#064e3b]">
                {selectedIssue!.attachments.length}
              </span>
            )}
          </div>
          <div className="flex flex-row items-center gap-1">
            <button
              title="Add attachment"
              disabled={isPending}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#064e3b]/60 hover:bg-[#064e3b]/5 hover:text-[#064e3b] transition-all border border-transparent hover:border-[#064e3b]/10 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => fileInputRef?.current?.click()}
            >
              {isPending ? (
                <span className="h-3 w-3 rounded-full border-2 border-[#064e3b]/40 border-t-[#064e3b] animate-spin" />
              ) : (
                <FaPlus size={10} />
              )}
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-[#064e3b]/40 hover:bg-[#064e3b]/5 hover:text-[#064e3b] transition-all border border-transparent hover:border-[#064e3b]/10 active:scale-90">
              <BsThreeDots size={14} />
            </button>
          </div>
        </div>

        {selectedIssue!.attachments.length > 0 ? (
          <div className="flex w-full flex-row gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {selectedIssue!.attachments.map((attachment, index) => (
              <div key={index} className="flex-shrink-0">
                <AttachmentCard
                  attachment={JSON.parse(attachment)}
                  handleDeleteAttachment={handleDeleteAttachment}
                />
              </div>
            ))}
          </div>
        ) : !isShowingTextEditor && (
          <div
            onClick={() => fileInputRef?.current?.click()}
            className="flex items-center gap-3 p-4 rounded-md border border-dashed border-[#064e3b]/20 bg-[#fcfcfb]/30 text-[#064e3b]/60 hover:bg-[#064e3b]/5 hover:border-[#064e3b]/30 cursor-pointer transition-all group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-[#064e3b]/10 text-[#064e3b]/40 group-hover:text-[#064e3b] transition-colors">
              <FaPlus size={12} />
            </div>
            <span className="text-xs font-bold font-manrope uppercase tracking-tight">Drop files or click to upload</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default MetadataSection;
