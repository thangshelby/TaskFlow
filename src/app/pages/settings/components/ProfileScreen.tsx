import React from "react";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
import { Camera, Save } from "lucide-react";

export const ProfileScreen: React.FC<{
  user: any;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsOpenModal: (isOpen: boolean) => void;
}> = ({ user, formData, handleInputChange, setIsOpenModal }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-[#1a1c1c] font-manrope">
          Profile Settings
        </h2>
        <p className="text-[#404944]">Manage your personal information and how you appear to others.</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="mb-8 flex items-center space-x-6">
          <div className="group relative cursor-pointer">
            <UserAvatar userId={user?.id} isDisplayName={false} size={80} />
            <div
              onClick={() => setIsOpenModal(true)}
              className="absolute inset-0 hidden rounded-full bg-black bg-opacity-40 transition-all group-hover:flex items-center justify-center text-white"
            >
              <Camera size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {formData.first_name} {formData.last_name}
            </h3>
            <p className="text-sm text-gray-500">{formData.email}</p>
            <button className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
              Change Avatar
            </button>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Bio
            </label>
            <textarea
              rows={4}
              placeholder="Write a short bio..."
              className="w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
