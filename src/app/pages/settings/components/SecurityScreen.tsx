import React, { useState } from "react";
import { Eye, EyeOff, Shield, ShieldCheck } from "lucide-react";

export const SecurityScreen: React.FC = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setTimeout(() => setIsChangingPassword(false), 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-[#1a1c1c] font-manrope">
          Security
        </h2>
        <p className="text-[#404944]">Protect your account and manage active sessions.</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${is2FAEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <button 
            onClick={() => setIs2FAEnabled(!is2FAEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${is2FAEnabled ? 'bg-emerald-600' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${is2FAEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <h3 className="mb-4 text-lg font-medium text-gray-900">Change Password</h3>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Current Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                className="w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 pr-10"
              />
              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600">
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 pr-10"
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600">
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-70"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h3 className="mb-1 text-lg font-medium text-gray-900">Active Sessions</h3>
        <p className="mb-6 text-sm text-gray-500">Manage devices that are currently logged into your account.</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-50 p-2 border border-gray-100">
                 <Shield className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">MacBook Pro - Chrome</p>
                <p className="text-xs text-gray-500">Ho Chi Minh City, Vietnam • Active Now</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">Current Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
