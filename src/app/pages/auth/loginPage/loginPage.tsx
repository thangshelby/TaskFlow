import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useAuth } from "@libs/hooks/apis/useAuth";
import Button from "@libs/app/components/general-components/button";
import { Lock, Mail } from "lucide-react";
import { AuthScaffold } from "@libs/app/components/auth/auth-scaffold";

// Schema definition with Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const isLoading = login.isPending;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    login.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <AuthScaffold
      title="Welcome back"
      subtitle="Enter your credentials to access your workspace."
      bottom={
        <p className="text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="font-semibold text-emerald-800 hover:underline"
          >
            Sign up
          </Link>
        </p>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email-address"
              className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500"
            >
              Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <input
                {...register("email")}
                id="email-address"
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
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500"
              >
                Password
              </label>
              <button
                type="button"
                disabled
                title="Coming soon"
                className="text-[11px] font-semibold text-emerald-800/60 hover:underline disabled:cursor-not-allowed disabled:no-underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <input
                {...register("password")}
                id="password"
                type="password"
                autoComplete="current-password"
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
        </div>

        <div className="pt-1">
          <Button
            variant="primary"
            isLoading={isLoading}
            type="submit"
            className="w-full rounded-sm! bg-linear-to-br from-emerald-950 to-emerald-800 py-3 font-semibold uppercase tracking-wide shadow-lg shadow-emerald-900/10 hover:opacity-95"
          >
            Sign in to workspace
          </Button>
        </div>
      </form>
    </AuthScaffold>
  );
};

export default LoginPage;
