import React, { lazy, useState, useTransition } from "react";
import { IIssue } from "@libs/types/issue";
import { FaPlus } from "react-icons/fa";
// import { TbHexagon3D } from "react-icons/tb";
import { BsThreeDots } from "react-icons/bs";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { uploadFileToCloudinary } from "@libs/utils/file";
import CustomInput from "../../general-components/customInput";

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file?.type.includes("image")) {
      const response = await uploadFileToCloudinary(undefined, file);
      const newAttachment = {
        url: response,
        type: file.type,
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
    }
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
    <div className="flex w-full flex-1 flex-col gap-2">
      {/* Summary */}
      <CustomInput
        field="summary"
        value={selectedIssue?.summary || ""}
        inputType="text"
        handleUpdateIssue={handleUpdateIssue}
        containerClassName="flex items-center w-full justify-between"
        contentClassName="text-sm font-medium! px-1 w-full text-gray-500"
      />

      {/* Description */}
      <div className="flex w-full flex-col items-start gap-1">
        {!isShowingTextEditor && (
          <p className="py-1 text-sm font-bold text-gray-600">Description</p>
        )}

        {isShowingTextEditor ? (
          <TextEditor
            initialDeltaString={selectedIssue?.description || ""}
            issueId={selectedIssue?.id || ""}
            projectId={selectedIssue?.project_id || ""}
            attachments={selectedIssue?.attachments || []}
            handleClose={() => {
              setIsShowingTextEditor(false);
            }}
          />
        ) : (
          <input
            onChange={() => {}}
            value={
              selectedIssue?.description &&
              selectedIssue!.description[0] === "{"
                ? JSON.parse(selectedIssue?.description || "{}")?.plainText
                : selectedIssue?.description
            }
            onClick={() => {
              startTransition(() => {
                setIsShowingTextEditor(true);
              });
            }}
            placeholder="Add a description"
            className="w-full rounded border border-gray-300 p-2 text-sm outline-none hover:bg-gray-100 focus:border-emerald-500"
          />
        )}
      </div>

      {/* Attachments */}
      {selectedIssue!.attachments.length ? (
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-1">
              <p className="text-sm font-bold text-gray-600">Attachments</p>
              <div className="bg-gray-300 px-2 text-sm font-medium text-gray-600">
                {selectedIssue!.attachments.length}
              </div>
            </div>
            <div className="flex flex-row items-center gap-1">
              <button
                className="relative cursor-pointer rounded-xs p-1 text-xs text-gray-800 hover:bg-gray-200"
                onClick={() => fileInputRef?.current?.click()}
              >
                <FaPlus />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute top-0 right-0"
                  multiple
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
              </button>
              <button className="cursor-pointer rounded-xs p-1 text-xs text-gray-800 hover:bg-gray-200">
                <BsThreeDots />
              </button>
            </div>
          </div>
          <div className="flex w-full flex-row gap-1 overflow-x-auto">
            {selectedIssue!.attachments.map((attachment, index) => (
              <AttachmentCard
                key={index}
                attachment={JSON.parse(attachment)}
                handleDeleteAttachment={handleDeleteAttachment}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default MetadataSection;
