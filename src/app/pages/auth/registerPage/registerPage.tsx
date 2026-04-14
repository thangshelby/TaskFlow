import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import Button from "@libs/app/components/general-components/button";
import { useAuth } from "@libs/hooks/apis/useAuth";
import { useAuthStore } from "@libs/store/useAuthStore";
import { CheckCircle2, Lock, Mail, User, XCircle } from "lucide-react";
import { AuthScaffold } from "@libs/app/components/auth/auth-scaffold";

// Define schema validation with Zod
const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" })
      .max(50, { message: "First name must not exceed 50 characters" }),
    last_name: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" })
      .max(50, { message: "Last name must not exceed 50 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least 1 uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least 1 lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least 1 number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least 1 special character",
      }),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Password confirmation does not match",
    path: ["password_confirm"],
  });

// Type from schema
type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register: registerMut } = useAuth();
  const isLoading = registerMut.isPending;
  const isSuccess = registerMut.isSuccess;
  const { error, setError: setStoreError } = useAuthStore();
  
  React.useEffect(() => {
    // Clear any stale errors from previous pages on mount
    setStoreError(null);
  }, [setStoreError]);

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirm: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setStoreError(null);
    registerMut.mutate(data, {
      onError: (error: any) => {
        const message = error.response?.data?.message;
        const code = error.response?.data?.code;
        // Code 6 typically represents "Already Exists" in some systems (e.g. gRPC ALREADY_EXISTS)
        // or we check the message content
        if (code === 6 || (message && message.toLowerCase().includes("email already exists"))) {
          setFormError("email", {
            type: "manual",
            message: message || "This email is already registered",
          });
        }
      },
    });
  };

  return (
    <AuthScaffold
      title="Create your account"
      subtitle="Set up your workspace access in a few minutes."
      bottom={
        <div className="space-y-3">
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-semibold text-emerald-800 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      }
    >
      <div className="space-y-3">
        {isSuccess && (
          <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" aria-hidden="true" />
              <p className="text-sm text-emerald-800">
                Registration successful! Please check your email to confirm your account.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 text-red-600" aria-hidden="true" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="first_name"
                className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500"
              >
                First name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <input
                  id="first_name"
                  {...register("first_name")}
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  className={`w-full rounded-sm bg-white py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm ring-1 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${errors.first_name
                    ? "ring-red-300 focus:ring-red-400"
                    : "ring-slate-200 focus:ring-emerald-500"
                    }`}
                />
              </div>
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="last_name"
                className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500"
              >
                Last name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <input
                  id="last_name"
                  {...register("last_name")}
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  className={`w-full rounded-sm bg-white py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm ring-1 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${errors.last_name
                    ? "ring-red-300 focus:ring-red-400"
                    : "ring-slate-200 focus:ring-emerald-500"
                    }`}
                />
              </div>
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500"
            >
              Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <input
                id="email"
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                className={`w-full rounded-sm bg-white py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm ring-1 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${errors.email
                  ? "ring-red-300 focus:ring-red-400"
                  : "ring-slate-200 focus:ring-emerald-500"
                  }`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500"
            >
              Create password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <input
                id="password"
                {...register("password")}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full rounded-sm bg-white py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm ring-1 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${errors.password
                  ? "ring-red-300 focus:ring-red-400"
                  : "ring-slate-200 focus:ring-emerald-500"
                  }`}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password_confirm"
              className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500"
            >
              Confirm password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <input
                id="password_confirm"
                {...register("password_confirm")}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full rounded-sm bg-white py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm ring-1 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${errors.password_confirm
                  ? "ring-red-300 focus:ring-red-400"
                  : "ring-slate-200 focus:ring-emerald-500"
                  }`}
              />
            </div>
            {errors.password_confirm && (
              <p className="text-sm text-red-500">
                {errors.password_confirm.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-1">
          <Button
            variant="primary"
            isLoading={isLoading}
            type="submit"
            className="w-full rounded-sm! bg-linear-to-br from-emerald-950 to-emerald-800 py-3 font-semibold uppercase tracking-wide shadow-lg shadow-emerald-900/10 hover:opacity-95"
          >
            Create account
          </Button>
        </div>
      </form>
    </AuthScaffold>
  );
};

export default RegisterPage;
