import React from "react";
import logo from "@libs/assets/taskflow.png";
import Image from "@libs/app/components/general-components/image";
import { Link } from "react-router-dom";
import { Github, Linkedin } from "lucide-react";

export interface AuthScaffoldProps {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
  bottom?: React.ReactNode;
  /** When false, hides GitHub/LinkedIn and the “Or continue with” divider (e.g. verify OTP step). Default true. */
  showSocialLogin?: boolean;
}

export function AuthScaffold({
  title,
  subtitle,
  children,
  bottom,
  showSocialLogin = true,
}: AuthScaffoldProps) {
  return (
    <section className="flex w-full flex-col justify-center bg-stone-50 px-8 py-10 md:px-12 lg:px-2">
      <div className="mx-auto w-full max-w-md">
        <AuthBrand />

        <div className="mb-8 space-y-2">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">{subtitle}</p>
        </div>

        {showSocialLogin ? (
          <>
            <AuthSocialButtons />
            <AuthDivider />
          </>
        ) : null}

        {children}

        {bottom ? <div className="mt-8">{bottom}</div> : null}
      </div>
    </section>
  );
}

export function AuthBrand() {
  return (
    <div className="mb-12 flex items-center justify-center md:justify-start">
      <Link
        to={"/"}
        className="group inline-flex items-center gap-3 rounded-sm px-2 py-1.5 transition-colors hover:bg-emerald-50"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-950 shadow-sm shadow-emerald-950/10">
          <span className="text-lg font-black tracking-tight text-emerald-50">T</span>
        </span>
        <Image src={logo} alt="Taskflow" className="h-[34px] w-[170px]" />
      </Link>
    </div>
  );
}

export function AuthSocialButtons() {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4">
      <button
        type="button"
        disabled
        title="Coming soon"
        aria-disabled="true"
        className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-sm bg-gray-200/90 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 opacity-80"
      >
        <Github className="h-[18px] w-[18px] text-slate-700" aria-hidden="true" />
        GitHub
      </button>
      <button
        type="button"
        disabled
        title="Coming soon"
        aria-disabled="true"
        className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-sm bg-gray-200/90 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 opacity-80"
      >
        <Linkedin className="h-[18px] w-[18px] text-slate-700" aria-hidden="true" />
        LinkedIn
      </button>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200/70" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-[0.22em]">
        <span className="bg-stone-50 px-4 text-[11px] font-semibold text-slate-500">
          Or continue with
        </span>
      </div>
    </div>
  );
}

