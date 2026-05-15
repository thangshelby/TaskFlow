import { useMutation } from "@tanstack/react-query";
import { getPresignedUploadImageUrl } from "@libs/apis/metadata";
import axios from "axios";

export function useUploadImage() {
  const { mutateAsync: uploadImage, isPending } = useMutation({
    mutationFn: async ({
      project_id,
      user_id,
      image,
    }: {
      project_id: string;
      user_id: string;
      image: File;
    }) => {
      const presignedUrl = await getPresignedUploadImageUrl({
        project_id,
        user_id,
        file_name: image.name,
        content_type: image.type,
      });

      axios.put(presignedUrl, image, {
        headers: {
          "Content-Type": image.type,
        },
      });

      return presignedUrl;
    },
  });

  return { uploadImage, isPending };
}
