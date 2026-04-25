import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Eye,
  EyeOff,
  Settings,
  Bell,
  Palette,
  Globe,
  Camera,
  Smartphone,
  Laptop,
  Monitor,
  CheckCircle2,
  ArrowRight,
  Fingerprint,
  Languages,
  MonitorDot,
} from "lucide-react";
import { useMe } from "@libs/hooks/apis/useUser";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
import UpdateAvatarModal from "@libs/app/components/projects/modals/updateAvatarModal";
import ImageCropProvider from "@libs/app/components/cropper/imageCropProvider";
export default function UserSettingsPage() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { data } = useMe();
  const user = data?.data;
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    old_password: "",
    password: "",
    confirm_password: "",
    role: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        old_password: "",
        password: "",
        confirm_password: "",
        role: user.role,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChangingPassword(true);

    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        old_password: "",
        password: "",
        confirm_password: "",
      }));
    }, 2000);
  };

  const sidebarItems = [
    { id: "profile", label: "Personal Profile", icon: User },
    { id: "account", label: "Account", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "language", label: "Language", icon: Globe },
  ];
  if (!user) return null;

  const renderProfileContent = () => (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-extrabold font-manrope text-[#1a1c1c] tracking-tighter mb-2">
          Personal Profile
        </h1>
        <p className="text-[#404944] font-body">Update your personal information and how it appears in the workspace.</p>
      </header>

      {/* Profile Section Bento-Style Card */}
      <div className="bg-[#f3f4f3] p-8 rounded-2xl space-y-12">
        {/* Avatar Upload Area */}
        <section className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
              <UserAvatar userId={user.id} isDisplayName={false} size={128} />
            </div>
            <button
              onClick={() => setIsOpenModal(true)}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#064e3b] text-white rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform"
            >
              <Camera size={18} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold font-manrope text-[#1a1c1c] mb-1">Profile Picture</h3>
            <p className="text-sm text-[#404944] mb-4">JPG, GIF or PNG. Maximum size 800K</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpenModal(true)}
                className="px-4 py-2 bg-white text-[#1a1c1c] text-sm font-medium rounded-lg border border-[#bfc9c3] hover:bg-gray-50 transition-colors shadow-sm"
              >
                Change Photo
              </button>
              <button className="px-4 py-2 text-[#ba1a1a] text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </section>

        {/* Form Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-[#404944] uppercase tracking-[0.05em] mb-2 font-label">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-[#bfc9c3] rounded-xl text-[#1a1c1c] focus:ring-2 focus:ring-[#95d3ba] focus:border-[#95d3ba] outline-none transition-all font-body"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-[#404944] uppercase tracking-[0.05em] mb-2 font-label">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-[#bfc9c3] rounded-xl text-[#1a1c1c] focus:ring-2 focus:ring-[#95d3ba] focus:border-[#95d3ba] outline-none transition-all font-body"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-bold text-[#404944] uppercase tracking-[0.05em] mb-2 font-label">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707974] flex items-center">
                <Settings size={20} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#bfc9c3] rounded-xl text-[#1a1c1c] focus:ring-2 focus:ring-[#95d3ba] focus:border-[#95d3ba] outline-none transition-all font-body"
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-bold text-[#404944] uppercase tracking-[0.05em] mb-2 font-label">
              Biography
            </label>
            <textarea
              className="w-full px-4 py-3 bg-white border border-[#bfc9c3] rounded-xl text-[#1a1c1c] focus:ring-2 focus:ring-[#95d3ba] focus:border-[#95d3ba] outline-none transition-all font-body resize-none"
              rows={4}
              placeholder="Tell us a bit about yourself..."
            ></textarea>
          </div>
        </section>

        {/* Advanced Settings Preview */}
        <section className="mt-8 pt-8 border-t border-[#bfc9c3]/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/80 transition-all border border-white/40 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#d7e7d7] flex items-center justify-center text-[#064e3b]">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1c1c]">Language</p>
                  <p className="text-xs text-[#404944]">English (US)</p>
                </div>
              </div>
              <Settings size={16} className="text-[#707974] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-5 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/80 transition-all border border-white/40 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#d7e7d7] flex items-center justify-center text-[#064e3b]">
                  <Palette size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1c1c]">Timezone</p>
                  <p className="text-xs text-[#404944]">GMT+7 (ICT)</p>
                </div>
              </div>
              <Settings size={16} className="text-[#707974] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="mt-12 flex items-center justify-end gap-4 pt-8 border-t border-[#bfc9c3]/30">
          <button className="px-6 py-2.5 text-[#404944] font-semibold text-sm hover:text-[#1a1c1c] transition-colors">
            Cancel
          </button>
          <button className="px-10 py-3 bg-[#064e3b] text-white rounded-xl font-manrope font-extrabold text-sm shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 hover:-translate-y-px transition-all active:scale-[0.95]">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityContent = () => (
    <div className="max-w-6xl mx-auto py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-[#404944]/60 uppercase tracking-widest mb-4">
        <span>Settings</span>
        <span className="text-gray-300">›</span>
        <span className="text-[#064e3b]">Security</span>
      </div>

      <header className="mb-10">
        <h1 className="text-4xl font-extrabold font-manrope text-[#1a1c1c] tracking-tighter mb-2 italic">
          Security
        </h1>
        <p className="text-[#404944] font-body max-w-2xl">
          Manage your credentials, authentication methods, and workspace access levels.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Change Password */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-[#bfc9c3]/30 p-8 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#d7e7d7] rounded-xl flex items-center justify-center text-[#064e3b]">
                <Fingerprint size={24} />
              </div>
              <h3 className="text-xl font-bold font-manrope text-[#1a1c1c]">Change Password</h3>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-[#404944] uppercase tracking-wider mb-2 font-label">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-[#f3f4f3]/50 border border-[#bfc9c3]/20 rounded-2xl text-[#1a1c1c] focus:ring-2 focus:ring-[#95d3ba] outline-none transition-all placeholder:text-gray-400"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-[#707974]"
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-[#404944] uppercase tracking-wider mb-2 font-label">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-[#f3f4f3]/50 border border-[#bfc9c3]/20 rounded-2xl text-[#1a1c1c] focus:ring-2 focus:ring-[#95d3ba] outline-none transition-all"
                      placeholder="Min. 12 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-4 flex items-center text-[#707974]"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#404944] uppercase tracking-wider mb-2 font-label">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-[#f3f4f3]/50 border border-[#bfc9c3]/20 rounded-2xl text-[#1a1c1c] focus:ring-2 focus:ring-[#95d3ba] outline-none transition-all"
                      placeholder="Repeat new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-4 flex items-center text-[#707974]"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="mt-4 px-8 py-4 bg-[#003527] text-white rounded-2xl font-manrope font-bold text-sm shadow-xl shadow-emerald-900/10 hover:-translate-y-px transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Permissions & 2FA */}
        <div className="space-y-6">
          <div className="bg-[#f3f4f3]/50 border border-[#bfc9c3]/20 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-[#bfc9c3]/30 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <Shield size={80} strokeWidth={1} />
            </div>
            <p className="text-[10px] font-bold text-[#404944]/60 uppercase tracking-widest mb-6">Current Permissions</p>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#064e3b]">
                <Shield size={20} />
              </div>
              <div>
                <p className="font-manrope font-bold text-[#1a1c1c]">Principal Architect</p>
                <p className="text-xs text-[#404944]/70">Global Admin Level</p>
              </div>
              <CheckCircle2 size={24} className="ml-auto text-[#064e3b]/20" strokeWidth={1.5} />
            </div>
            <div className="bg-white/60 p-4 rounded-xl border border-white/40 text-[11px] text-[#404944] leading-relaxed italic">
              Contact administrator to change your role.
            </div>
          </div>

          <div className="bg-[#003527] p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 opacity-10 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
              <Settings size={120} />
            </div>
            <p className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-4">Security Tip</p>
            <h4 className="text-xl font-bold font-manrope mb-4 leading-tight italic">Enable Two-Factor Authentication</h4>
            <p className="text-xs text-emerald-100/60 mb-8 leading-relaxed">Add a layer of security to your account by requiring a code from your phone.</p>
            <button className="flex items-center gap-2 text-sm font-bold text-white hover:gap-4 transition-all">
              Configure 2FA <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions Section */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-extrabold font-manrope text-[#1a1c1c] tracking-tight italic">Active Sessions</h3>
            <p className="text-sm text-[#404944]">Manage the devices you are currently logged into.</p>
          </div>
          <button className="text-sm font-bold text-[#ba1a1a] hover:underline transition-all">Log out all sessions</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Laptop, name: "MacBook Pro 16\"", details: "Chrome · San Francisco, CA", status: "CURRENT" },
            { icon: Smartphone, name: "iPhone 15 Pro", details: "TaskFlow App · London, UK", status: "LAST ACTIVE 2H AGO" },
            { icon: Monitor, name: "Workstation-92", details: "Firefox · Berlin, DE", status: "LAST ACTIVE 4D AGO" },
          ].map((session, idx) => (
            <div key={idx} className="bg-[#f3f4f3]/50 p-6 rounded-2xl border border-[#bfc9c3]/10 hover:bg-white hover:shadow-sm transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#707974] group-hover:text-[#064e3b] transition-colors">
                  <session.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1c1c]">{session.name}</p>
                  <p className="text-[11px] text-[#404944]/60 mb-4">{session.details}</p>
                  <span className={`text-[10px] font-black tracking-wider px-2 py-1 rounded-md ${session.status === 'CURRENT' ? 'bg-[#d7e7d7] text-[#064e3b]' : 'bg-gray-200 text-gray-500'}`}>
                    {session.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderPreferencesContent = () => (
    <div className="max-w-6xl mx-auto py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-[#404944]/60 uppercase tracking-widest mb-4">
        <span>Workspace Configuration</span>
        <span className="text-gray-300">›</span>
        <span className="text-[#064e3b]">Preferences</span>
      </div>

      <header className="mb-10">
        <h1 className="text-4xl font-extrabold font-manrope text-[#1a1c1c] tracking-tighter mb-2 italic">
          Preferences & Language
        </h1>
        <p className="text-[#404944] font-body max-w-2xl">
          Customize how the Engineering Atelier environment feels. Optimize your focus sessions and localized workspace standards.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Language & Notifications */}
        <div className="lg:col-span-2 space-y-8">
          {/* Language Section */}
          <div className="bg-white border border-[#bfc9c3]/30 p-8 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#d7e7d7] rounded-xl flex items-center justify-center text-[#064e3b]">
                <Languages size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-manrope text-[#1a1c1c]">Language Settings</h3>
                <p className="text-sm text-[#404944]/70">Select your primary interface language.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "en", name: "English (US)", desc: "Default Interface", active: true },
                { id: "vi", name: "Vietnamese", desc: "Vietnamese", active: false },
                { id: "de", name: "Deutsch", desc: "German", active: false },
                { id: "jp", name: "日本語", desc: "Japanese", active: false },
              ].map((lang) => (
                <div
                  key={lang.id}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${lang.active
                    ? "border-[#064e3b] bg-[#f3f4f3]/50"
                    : "border-[#bfc9c3]/20 hover:border-[#064e3b]/30 hover:bg-[#f3f4f3]/30"
                    }`}
                >
                  <div>
                    <p className="font-bold text-[#1a1c1c]">{lang.name}</p>
                    <p className="text-xs text-[#404944]/60">{lang.desc}</p>
                  </div>
                  {lang.active && <CheckCircle2 size={20} className="text-[#064e3b]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white border border-[#bfc9c3]/30 p-8 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#d7e7d7] rounded-xl flex items-center justify-center text-[#064e3b]">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-manrope text-[#1a1c1c]">Communication Channels</h3>
                <p className="text-sm text-[#404944]/70">Manage how you receive notifications.</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: "Email Notifications", desc: "Daily digest, security alerts, and system updates.", active: true },
                { title: "Push Notifications", desc: "Real-time alerts for task assignments and mentions.", active: false },
                { title: "Browser Badges", desc: "Show unread count on the application tab icon.", active: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-[#f3f4f3]/30 rounded-2xl border border-[#bfc9c3]/10 hover:bg-[#f3f4f3]/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-bold text-[#1a1c1c]">{item.title}</p>
                    <p className="text-xs text-[#404944]/60">{item.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer p-1 transition-colors ${item.active ? 'bg-[#064e3b]' : 'bg-[#bfc9c3]/40'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${item.active ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Display & Region */}
        <div className="space-y-6">
          {/* Display Mode Card */}
          <div className="bg-[#064e3b] p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 opacity-10 -translate-y-4 translate-x-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
              <MonitorDot size={140} />
            </div>
            <h3 className="text-xl font-bold font-manrope mb-2 italic">Display Mode</h3>
            <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-8">FORGE FOREST DARK</p>

            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 rounded-full bg-white"></div>
              <div className="flex-1 h-1 bg-white/20 rounded-full"></div>
            </div>

            <button className="w-full py-4 bg-white text-[#064e3b] rounded-2xl font-manrope font-bold text-sm shadow-xl shadow-black/10 hover:opacity-90 transition-all active:scale-[0.98]">
              Switch to Light Mode
            </button>
          </div>

          {/* UI Density Card */}
          <div className="bg-white border border-[#bfc9c3]/30 p-8 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold font-manrope text-[#1a1c1c] mb-6 flex items-center gap-2">
              <Shield size={18} className="text-[#064e3b]" /> UI Density
            </h3>
            <div className="space-y-3">
              {["Engineering (High)", "Standard (Medium)", "Comfort (Low)"].map((density, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${idx === 0 ? 'bg-[#064e3b]/5 border-[#064e3b]/20 text-[#064e3b]' : 'border-[#bfc9c3]/20 hover:bg-[#f3f4f3]/50'}`}>
                  <span className="text-sm font-bold">{density}</span>
                  {idx === 0 && <CheckCircle2 size={16} />}
                </div>
              ))}
            </div>
          </div>

          {/* Region Card */}
          <div className="bg-white border border-[#bfc9c3]/30 p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-bold font-manrope text-[#1a1c1c] mb-6 flex items-center gap-2">
              <Globe size={18} className="text-[#064e3b]" /> Region & Time
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-[#404944]/60 uppercase tracking-widest mb-2 block">TIMEZONE</label>
                <div className="p-3 bg-[#f3f4f3]/50 border border-[#bfc9c3]/20 rounded-xl text-sm font-medium flex items-center justify-between">
                  <span>(GMT+07:00) Bangkok, Hanoi</span>
                  <ArrowRight size={14} className="rotate-90 text-[#bfc9c3]" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#404944]/60 uppercase tracking-widest mb-2 block">FIRST DAY OF WEEK</label>
                <div className="p-3 bg-[#f3f4f3]/50 border border-[#bfc9c3]/20 rounded-xl text-sm font-medium flex items-center justify-between">
                  <span>Monday</span>
                  <ArrowRight size={14} className="rotate-90 text-[#bfc9c3]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Footer Footer */}
      <footer className="mt-16 flex items-center justify-end gap-4 pt-8 border-t border-[#bfc9c3]/30">
        <button className="px-6 py-2.5 text-[#404944] font-semibold text-sm hover:text-[#1a1c1c] transition-colors">
          Restore Defaults
        </button>
        <button className="px-10 py-3 bg-[#064e3b] text-white rounded-xl font-manrope font-extrabold text-sm shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 hover:-translate-y-px transition-all active:scale-[0.95]">
          Save Changes
        </button>
      </footer>
    </div>
  );




  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileContent();
      case "account":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                Account Settings
              </h2>
              <p className="text-gray-600">Manage your account settings</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-gray-500">
                Account settings content will be added here.
              </p>
            </div>
          </div>
        );
      case "security":
        return renderSecurityContent();
      case "preferences":
        return renderPreferencesContent();
      default:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                Under Development
              </h2>
              <p className="text-gray-600">
                This feature is currently under development
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-gray-500">Content will be added here.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <ImageCropProvider
      max_zoom={6}
      min_zoom={1}
      zoom_step={0.1}
      max_rotation={180}
      min_rotation={-180}
      rotation_step={1}
    >
      <div className="min-h-screen bg-[#f3f4f3]">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0 bg-[#f3f4f3] border-r border-[#bfc9c3]/20 py-8 px-6 flex flex-col sticky top-0 h-screen">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 bg-[#064e3b] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
                  <Settings size={22} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-extrabold text-[#064e3b] font-manrope tracking-tight">Settings</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-[#bfc9c3]/20">
                <div className="relative group cursor-pointer">
                  <UserAvatar userId={user.id} isDisplayName={false} size={44} />
                  <div
                    onClick={() => setIsOpenModal(true)}
                    className="absolute inset-0 hidden rounded-full bg-black/40 text-white group-hover:flex items-center justify-center transition-all"
                  >
                    <Camera size={14} />
                  </div>
                </div>
                <div className="overflow-hidden">
                  <p className="font-manrope text-sm font-bold text-[#064e3b] truncate">
                    {formData.first_name} {formData.last_name}
                  </p>
                  <p className="text-[10px] text-[#404944]/70 font-bold tracking-wider uppercase truncate">
                    {formData.role || "Member"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1.5">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                      ? "bg-white text-[#064e3b] shadow-sm border border-[#bfc9c3]/10"
                      : "text-[#404944] hover:bg-[#f9f9f8] hover:text-[#064e3b]"
                      }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-[#064e3b]" : "text-[#707974]"}`} />
                    <span className="font-manrope tracking-tight">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 px-12 overflow-y-auto bg-[#f3f4f3]">
            <div className="py-8">{renderContent()}</div>
          </main>
        </div>

        <UpdateAvatarModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          user={user}
        />
      </div>
    </ImageCropProvider>
  );
}