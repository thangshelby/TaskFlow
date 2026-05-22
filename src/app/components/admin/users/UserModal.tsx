import React, { useEffect } from "react";
import { X, User, Shield, Mail, Lock, AlertTriangle } from "lucide-react";
import { IUser } from "@libs/types/user";

export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: "Admin" | "User";
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  editingUser: IUser | null;
  isLoading?: boolean;
}

const InputField = ({
  label,
  icon,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="ml-1 text-red-400">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
  </div>
);

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
  isLoading,
}) => {
  const [formData, setFormData] = React.useState<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "User",
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
        role: editingUser.role,
      });
    } else {
      setFormData({ first_name: "", last_name: "", email: "", password: "", role: "User" });
    }
  }, [editingUser, isOpen]);

  const set = (key: keyof UserFormData) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl shadow-slate-900/20 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
              <User className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {editingUser ? "Edit User" : "Create New User"}
              </h3>
              <p className="text-xs text-slate-500">
                {editingUser ? "Update user information and role" : "Add a new user to the system"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                icon={<User className="h-4 w-4" />}
                value={formData.first_name}
                onChange={set("first_name")}
                placeholder="John"
                required
              />
              <InputField
                label="Last Name"
                icon={<User className="h-4 w-4" />}
                value={formData.last_name}
                onChange={set("last_name")}
                placeholder="Doe"
                required
              />
            </div>

            <InputField
              label="Email Address"
              icon={<Mail className="h-4 w-4" />}
              type="email"
              value={formData.email}
              onChange={set("email")}
              placeholder="john@example.com"
              required
              disabled={!!editingUser}
            />

            {!editingUser && (
              <InputField
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                type="password"
                value={formData.password ?? ""}
                onChange={set("password")}
                placeholder="Min. 8 characters"
                required
              />
            )}

            {/* Role Selector */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Role <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["User", "Admin"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role }))}
                    className={`flex items-center gap-2.5 rounded-lg border-2 p-3 text-left transition-all ${
                      formData.role === role
                        ? role === "Admin"
                          ? "border-violet-400 bg-violet-50 text-violet-700"
                          : "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {role === "Admin" ? (
                      <Shield className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">{role}</p>
                      <p className="text-xs opacity-70">
                        {role === "Admin" ? "Full system access" : "Standard access"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {formData.role === "Admin" && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Admin users have full access to the admin portal including user management and system settings.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:outline-none transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : editingUser ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
