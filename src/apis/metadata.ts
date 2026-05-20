import api from "./api";

export interface PresignedUploadResult {
  presigned_url: string;
  file_url: string;
}

export const getPresignedUploadUrl = async ({
  project_id,
  user_id,
  file_name,
  content_type,
  upload_type = "attachment",
}: {
  project_id: string;
  user_id: string;
  file_name: string;
  content_type: string;
  upload_type?: string;
}): Promise<PresignedUploadResult> => {
  const response = await api.post("/metadata/upload", {
    project_id,
    user_id,
    file_name,
    content_type,
    upload_type,
  });

  return {
    presigned_url: response.data.presigned_url,
    file_url: response.data.file_url,
  };
};
