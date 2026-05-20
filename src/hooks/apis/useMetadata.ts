import { useMutation } from "@tanstack/react-query";
import { getPresignedUploadUrl } from "@libs/apis/metadata";
import axios from "axios";

/**
 * Hook upload file lên S3 qua presigned URL.
 * Dùng được cho mọi loại file: image, pdf, docx, xlsx, v.v.
 * Trả về file_url sạch (không có query params) để lưu vào DB.
 */
export function useUpload() {
  const { mutateAsync: upload, isPending } = useMutation({
    mutationFn: async ({
      project_id,
      user_id,
      file,
      upload_type = "attachment",
    }: {
      project_id: string;
      user_id: string;
      file: File;
      upload_type?: string;
    }): Promise<string> => {
      // 1. Lấy presigned URL từ backend
      const { presigned_url, file_url } = await getPresignedUploadUrl({
        project_id,
        user_id,
        file_name: file.name,
        content_type: file.type,
        upload_type,
      });

      // 2. PUT file trực tiếp lên S3 qua presigned URL
      await axios.put(presigned_url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. Trả về file_url sạch để lưu vào attachment
      return file_url;
    },
  });

  return { upload, isPending };
}
