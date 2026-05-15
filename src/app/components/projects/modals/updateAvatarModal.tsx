import { useState, useEffect } from "react";
import { uploadFileToCloudinary } from "@libs/utils/file";
import { readFile } from "@libs/utils/cropImage";
import { useImageCropContext } from "../../cropper/imageCropProvider";
import Button from "../../general-components/button";
import Cropper from "../../cropper/cropper";
import { RotationSlider, ZoomSlider } from "../../cropper/slider";
import { useUpdateUser } from "@libs/hooks/apis/useUser";
import Modal from "../../general-components/modal/modal";
import { IUser } from "@libs/types/user";
import "@libs/app/components/projects/modals/modal.css";

const UpdateAvatarModal = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
}) => {
  const { setImage } = useImageCropContext();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const { mutateAsync: updateUserMutation, isPending } = useUpdateUser();

  useEffect(() => {
    if (user) {
      setImage(user.avatar ? user.avatar : "");
    }
  }, [user]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files && event.target.files[0];
    const imageDataUrl = await readFile(file!);
    setImageFile(file);
    setImage(imageDataUrl);
  };

  const handleUpdateAvatar = async () => {
    setIsUploadLoading(true);
    if (!imageFile) return;
    const imageUploadUrl = await uploadFileToCloudinary("", imageFile);
    if (imageUploadUrl) {
      await updateUserMutation({
        user_id: user.id,
        avatar: imageUploadUrl,
      });
      setIsUploadLoading(false);
      onClose();
    }
  };
  if (!isOpen) return null;

  return (
    <Modal
      title="Cập nhật ảnh đại diện"
      onClose={onClose}
      onSubmit={handleUpdateAvatar}
      isLoadingButton={isUploadLoading || isPending}
      buttonContent="Cập nhật ảnh"
      className="rounded-xl border border-white/40 shadow-2xl glass-panel"
    >
      <div className="relative text-center">
        <h5 className="mb-4 text-gray-800">Edit profile picture</h5>
        <div className="rounded-lg border border-dashed border-gray-200 p-6">
          <div className="flex justify-center">
            <div className="crop-container mb-4">
              <Cropper />
            </div>
          </div>
          <ZoomSlider className="mb-4" />
          <RotationSlider className="mb-4" />
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="avatarInput"
            accept="image/*"
          />

          <Button
            variant="light"
            className="mb-4 w-full shadow hover:shadow-lg"
          >
            <label htmlFor="avatarInput">Upload Another Picture</label>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateAvatarModal;
