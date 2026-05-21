import React from "react";
import logo from "@libs/assets/taskflow.png";
import Image from "@libs/app/components/general-components/image";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

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
    const handleGoogleLogin = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "185490340854-9rgapdmtf42qbupkbhf57j3jstqnikln.apps.googleusercontent.com";
        const redirectUri = window.location.origin + "/auth/callback";
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&state=google`;
        window.location.href = googleAuthUrl;
    };

    const handleGithubLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || "your_github_client_id_here";
        const redirectUri = window.location.origin + "/auth/callback";
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user%20user:email&state=github`;
        window.location.href = githubAuthUrl;
    };

    return (
        <div className="mb-8 grid grid-cols-2 gap-4">
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-white hover:bg-slate-50 active:bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs ring-1 ring-slate-200 transition-all hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer"
            >
                <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Google
            </button>
            <button
                type="button"
                onClick={handleGithubLogin}
                className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-white hover:bg-slate-50 active:bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs ring-1 ring-slate-200 transition-all hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer"
            >
                <Github className="h-[18px] w-[18px] text-slate-800 shrink-0" aria-hidden="true" />
                GitHub
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

