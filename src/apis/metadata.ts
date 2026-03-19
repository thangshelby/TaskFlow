import api from "./api";

export const getPresignedUploadImageUrl = async ({
  project_id,
  user_id,
  file_name,
  content_type,
}: {
  project_id: string;
  user_id: string;
  file_name: string;
  content_type: string;
}) => {
  const response = await api.post("/metadata/upload-url", {
    project_id: project_id,
    user_id,
    file_name,
    content_type: content_type,
  });

  return response.data;
};
