import React, { useRef, useState } from "react";
import { projectMembers } from "@libs/apis/projectMember";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@libs/app/components/general-components/modal/modal";
import { Dropdown } from "antd";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaAngleDown } from "react-icons/fa";
import { TeamMemberRole } from "@libs/types/projectMember";
import "@libs/app/components/projects/modals/modal.css";
interface AddProjectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const MemberRoleOptions = [
  { value: "ADMIN", label: "Admin", description: "Admin" },
  { value: "MEMBER", label: "Member", description: "Member" },
  { value: "OWNER", label: "Owner", description: "Owner" },
  { value: "VIEWER", label: "Viewer", description: "Viewer" },
];
const memberSchema = z.object({
  email: z.string().email("Valid email is required"),
  role: z.enum(["ADMIN", "MEMBER", "OWNER", "VIEWER"] as const),
});

type MemberFormData = z.infer<typeof memberSchema>;

const AddProjectMemberModal: React.FC<AddProjectMemberModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const queryClient = useQueryClient();
  const dropDownRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  // const { addProjectMemberAsync, isLoading } = useAddProjectMember(projectId);

  const addMember = useMutation({
    mutationFn: async (data: MemberFormData) => {
      // First get the user by email
      const userResponse = await projectMembers.getUserByEmail(data.email);
      if (!userResponse.data.data) {
        throw new Error("User not found");
      }

      // Then add the user to the project
      const userId = userResponse.data.data.id;
      return projectMembers.add({
        project_id: projectId,
        user_id: userId,
        role: data.role as TeamMemberRole,
      });
    },
    onSuccess: () => {
      toast.success("Member added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
      reset();
      onClose();
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add member. Please try again.");
      }
    },
  });

  const [isOpenSelectOption, setIsOpenSelectOption] = useState(false);

  const handleFormSubmit: SubmitHandler<MemberFormData> = (data) => {
    addMember.mutate(data);
  };

  const role = watch("role");

  if (!isOpen) return null;

  return (
    <Modal
      title="Invite people"
      onClose={onClose}
      buttonContent={addMember.isPending ? "Sending..." : "Send Invitation"}
      onSubmit={() => handleSubmit(handleFormSubmit)()}
      isLoadingButton={addMember.isPending}
      className="rounded-xl border border-white/40 shadow-2xl glass-panel"
    >
      <div className="p-4">
        <form className="space-y-4">
          <div className="mb-4 text-sm text-gray-500">
            An invitation will be sent to the user's email. They will need to
            accept it to join the project.
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name, email or group
            </label>
            <input
              type="text"
              {...register("email")}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors duration-200"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <div ref={dropDownRef}>
              <Dropdown
                popupRender={(menu) => (
                  <div
                    style={{
                      width: dropDownRef.current?.offsetWidth || "100%",
                    }}
                  >
                    {menu}
                  </div>
                )}
                className="!rounded-md !p-2"
                menu={{
                  style: {
                    padding: "12px 0px",
                  },
                  items: MemberRoleOptions.map(
                    (option: {
                      value: string;
                      label: string;
                      description: string;
                    }) => ({
                      style: {
                        padding: "0px",
                        width: "100%",
                      },
                      key: option.value,
                      label: (
                        <div
                          className={`flex flex-col border-l-2 border-transparent px-3 py-2 leading-5 hover:border-l-emerald-500 hover:bg-emerald-50 ${role == option.value && "border-l-emerald-500 bg-emerald-50"}`}
                        >
                          <p
                            className={`text-sm font-semibold ${role == option.value ? "text-emerald-600" : "text-gray-700"}`}
                          >
                            {option.label}
                          </p>
                          <p className="text-xs leading-4 font-normal text-gray-400">
                            {option.description}
                          </p>
                        </div>
                      ),
                      onClick: () => {
                        setValue("role", option.value as TeamMemberRole);
                      },
                    }),
                  ),
                }}
                trigger={["click"]}
                open={isOpenSelectOption}
                onOpenChange={setIsOpenSelectOption}
              >
                <div
                  className={`relative w-full cursor-pointer rounded-md border p-2.5 text-sm font-normal transition-all duration-200 ${
                    isOpenSelectOption
                      ? "border-emerald-500 bg-white text-gray-800 ring-1 ring-emerald-500 shadow-sm"
                      : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  {MemberRoleOptions.find((o) => o.value === role)?.label || role}
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <FaAngleDown className={`transition-transform duration-200 ${isOpenSelectOption ? "rotate-180 text-emerald-500" : ""}`} />
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddProjectMemberModal;
