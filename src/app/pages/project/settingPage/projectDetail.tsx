import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Flag, MoreHorizontal, Info, Save, Calendar as CalendarIcon, ImagePlus, Loader2 } from "lucide-react";
import { useProjectByID, useUpdateProject } from "@libs/hooks/apis/useProject";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
import { toast } from "react-toastify";
import LoadingFallback from "@libs/app/components/general-components/loadingFallback";
import { UI_COMMON_SIZES } from "@libs/app/components/general-components/constants/uiConfig";
import { useUpload } from "@libs/hooks/apis/useMetadata";
import { useAuthStore } from "@libs/store/useAuthStore";
import DatePicker from "antd/lib/date-picker";
import dayjs from "dayjs";

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading } = useProjectByID(projectId || "");
  const { updateProject, isLoading: isUpdating } = useUpdateProject({
    onClose: () => {},
  });
  const { upload } = useUpload();
  const userId = useAuthStore((state) => state.user?.id);

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
    type: "Scrum" as "Scrum" | "Kanban",
    access: "Public",
    due_date_from: undefined as string | undefined,
    due_date_to: undefined as string | undefined,
    background_img: "" as string | undefined,
    owner_id: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        key: project.key || "",
        description: project.description || "",
        type: project.type || "Scrum",
        access: project.access || "Public",
        due_date_from: project.due_date_from,
        due_date_to: project.due_date_to,
        background_img: project.background_img || "",
        owner_id: project.owner_id || "",
      });
    }
  }, [project]);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
    setIsUploadingBanner(true);
    try {
      const bannerUrl = await upload({
        project_id: projectId || "",
        user_id: userId || "",
        file,
        upload_type: "avatar",
      });
      if (bannerUrl) {
        handleInputChange("background_img", bannerUrl);
        // Optionally update immediately like in team detail
        await updateProject({
          id: projectId,
          data: { ...formData, background_img: bannerUrl },
        });
      }
    } catch (err) {
      console.error("Failed to upload project banner:", err);
      toast.error("Failed to upload banner image");
    } finally {
      setIsUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!projectId) return;
    try {
      await updateProject({
        id: projectId,
        data: formData,
      });
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  if (isLoading) return <LoadingFallback />;

  if (!project) {
    return (
      <div className="flex h-64 items-center justify-center font-manrope text-[#064e3b]/60 uppercase tracking-widest text-xs font-black">
        Project not found
      </div>
    );
  }

  const DatePickerStyles = {
    height: "48px",
    borderRadius: "12px",
    border: "1px solid rgba(6, 78, 59, 0.1)",
    fontFamily: "Manrope, sans-serif",
    fontSize: "14px",
    fontWeight: "700",
    color: "#064e3b",
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header Detail */}
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between mb-6">
        <h2 className="font-manrope text-2xl font-black text-[#064e3b]">Details</h2>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="rounded-xl p-2.5 text-[#064e3b]/30 transition-colors hover:bg-[#064e3b]/5 hover:text-[#064e3b]"
          >
            <MoreHorizontal size={20} />
          </button>
          
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-[#064e3b]/10 bg-white py-2 shadow-xl shadow-[#064e3b]/5 animate-scale-in">
                <button className="flex w-full items-center px-4 py-2.5 font-manrope text-xs font-bold text-[#064e3b] transition-colors hover:bg-[#064e3b]/5">
                  Export project
                </button>
                <button className="flex w-full items-center px-4 py-2.5 font-manrope text-xs font-bold text-[#064e3b] transition-colors hover:bg-[#064e3b]/5">
                  Archive project
                </button>
                <div className="my-1 border-t border-[#064e3b]/5" />
                <button className="flex w-full items-center px-4 py-2.5 font-manrope text-xs font-bold text-red-500 transition-colors hover:bg-red-50">
                  Delete project
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl">
        {/* Premium Banner Section */}
        <div 
          className="group relative mb-12 flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[#064e3b]/10"
          style={{ 
            borderRadius: UI_COMMON_SIZES.medium.borderRadius,
            background: formData.background_img
              ? undefined
              : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          }}
        >
          {formData.background_img && (
            <img
              src={formData.background_img}
              alt="Project banner"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Hover overlay */}
          <div
            onClick={() => !isUploadingBanner && bannerInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-[#064e3b]/20 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-white/20 p-4 shadow-xl ring-1 ring-white/50">
                {isUploadingBanner ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <ImagePlus className="h-6 w-6 text-white" />
                )}
              </div>
              <span className="font-manrope text-[10px] font-black uppercase tracking-widest text-white">
                {isUploadingBanner ? "Uploading..." : "Change Cover Image"}
              </span>
            </div>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
            />
          </div>
          
          {!formData.background_img && !isUploadingBanner && (
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <Flag size={40} className="text-white/40" />
              <span className="font-manrope text-[10px] font-black uppercase tracking-widest text-white/40">
                Default Theme
              </span>
            </div>
          )}
        </div>

        {/* Form Sections */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* General Info */}
          <div className="space-y-6">
            <div>
              <label className="mb-2 block font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
                Project Name *
              </label>
              <input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full h-12 rounded-xl border border-[#064e3b]/10 bg-white px-4 font-manrope text-sm text-[#064e3b] transition-all focus:border-[#064e3b]/30 focus:outline-none focus:ring-4 focus:ring-[#064e3b]/5"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-1.5 font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
                Space Key * <Info size={12} className="opacity-50" />
              </label>
              <input
                value={formData.key}
                onChange={(e) => handleInputChange("key", e.target.value.toUpperCase())}
                className="w-full h-12 rounded-xl border border-[#064e3b]/10 bg-white px-4 font-manrope text-sm font-bold text-[#064e3b] transition-all focus:border-[#064e3b]/30 focus:outline-none focus:ring-4 focus:ring-[#064e3b]/5"
                placeholder="PROJ"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
                  Project Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#064e3b]/10 bg-white px-4 font-manrope text-sm font-bold text-[#064e3b] transition-all focus:border-[#064e3b]/30 focus:outline-none focus:ring-4 focus:ring-[#064e3b]/5 appearance-none"
                >
                  <option value="Scrum">Scrum</option>
                  <option value="Kanban">Kanban</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
                  Access Level
                </label>
                <select
                  value={formData.access}
                  onChange={(e) => handleInputChange("access", e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#064e3b]/10 bg-white px-4 font-manrope text-sm font-bold text-[#064e3b] transition-all focus:border-[#064e3b]/30 focus:outline-none focus:ring-4 focus:ring-[#064e3b]/5 appearance-none"
                >
                  <option value="Public">Public Access</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline & Ownership */}
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
                  Due From
                </label>
                <DatePicker
                  placeholder="START DATE"
                  value={formData.due_date_from ? dayjs(formData.due_date_from) : null}
                  onChange={(date) => handleInputChange("due_date_from", date ? date.toISOString() : undefined)}
                  className="w-full premium-datepicker"
                  style={DatePickerStyles}
                  suffixIcon={<CalendarIcon size={14} className="text-[#064e3b]/30" />}
                />
              </div>
              <div>
                <label className="mb-2 block font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
                  Due To
                </label>
                <DatePicker
                  placeholder="END DATE"
                  value={formData.due_date_to ? dayjs(formData.due_date_to) : null}
                  onChange={(date) => handleInputChange("due_date_to", date ? date.toISOString() : undefined)}
                  className="w-full premium-datepicker"
                  style={DatePickerStyles}
                  suffixIcon={<CalendarIcon size={14} className="text-[#064e3b]/30" />}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
                Space Owner
              </label>
              <div className="flex items-center gap-4 rounded-2xl border border-[#064e3b]/5 bg-[#064e3b]/2 p-4">
                <UserAvatar userId={project.owner_id} size={40} isDisplayName />
              </div>
              <p className="mt-2 font-manrope text-[10px] font-medium text-[#064e3b]/40 leading-relaxed italic">
                The space owner has full administrative rights to this project.
              </p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-8">
          <label className="mb-2 block font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
            Project Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={5}
            className="w-full rounded-2xl border border-[#064e3b]/10 bg-white p-5 font-manrope text-sm leading-relaxed text-[#064e3b] transition-all focus:border-[#064e3b]/30 focus:outline-none focus:ring-4 focus:ring-[#064e3b]/5"
            placeholder="Outline the goals and scope of this project..."
          />
        </div>

        {/* Action Footer */}
        <div className="mt-10 flex justify-end border-t border-[#064e3b]/5 pt-8">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className={`flex h-12 items-center gap-2.5 rounded-xl px-10 font-manrope text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-all ${
              isUpdating
                ? "bg-[#064e3b]/30 cursor-not-allowed"
                : "bg-[#064e3b] shadow-[#064e3b]/20 hover:bg-[#064e3b]/90 hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {isUpdating ? <MoreHorizontal size={16} className="animate-pulse" /> : <Save size={16} />}
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
