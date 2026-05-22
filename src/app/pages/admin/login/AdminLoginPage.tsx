import React from "react";
import { ShieldAlert, ArrowRight, Lock, Key } from "lucide-react";

const AdminLoginPage: React.FC = () => {
  const handleCognitoLogin = () => {
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const redirectUri = window.location.origin + "/admin";

    if (!cognitoDomain || !clientId) {
      alert(
        "Missing AWS Cognito environment configurations.\nPlease ensure VITE_COGNITO_DOMAIN and VITE_COGNITO_CLIENT_ID are set in your .env file."
      );
      return;
    }

    const authorizeUrl = `${cognitoDomain}/login/continue?client_id=63iptbpsld04aacm469jvlc8m9&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fadmin&response_type=code&scope=email+openid+phone`;
    window.location.href = authorizeUrl;
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-stone-950 p-6 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse duration-[8000ms]" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse duration-[10000ms]" />

      <div className="relative w-full max-w-lg rounded-2xl border border-stone-800/80 bg-stone-900/40 p-10 shadow-2xl shadow-emerald-950/10 backdrop-blur-2xl transition-all duration-300">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-emerald-500 via-teal-500 to-blue-500" />

        <div className="flex flex-col items-center text-center">
          {/* Animated Shield Header */}
          <div className="relative mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-tr from-stone-900 to-stone-800 border border-stone-700/50 shadow-lg shadow-emerald-500/5">
            <div className="absolute inset-0 rounded-xl bg-emerald-500/5 blur-md" />
            <ShieldAlert className="h-8 w-8 text-emerald-400" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-stone-50">
              TaskFlow <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">Admin Portal</span>
            </h1>
            <p className="text-sm text-stone-400 max-w-sm mx-auto">
              Secured workspace management environment. Unauthorized access attempts are strictly monitored.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="mt-8 w-full space-y-3 rounded-lg border border-stone-800/60 bg-stone-950/30 p-5 text-left">
            <div className="flex items-center gap-3 text-stone-300 text-xs">
              <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Multi-Factor Authentication (MFA) Enabled</span>
            </div>
            <div className="flex items-center gap-3 text-stone-300 text-xs">
              <Key className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Single Sign-On (SSO) Federated identity</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleCognitoLogin}
            className="group relative mt-8 flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg bg-emerald-500 px-6 py-4 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-emerald-500/10 hover:bg-emerald-400 hover:shadow-emerald-400/25 active:scale-98 transition-all cursor-pointer"
          >
            <span>Sign In with AWS Cognito</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <span className="mt-6 text-2xs text-stone-500 tracking-widest uppercase">
            Secured by AWS IAM & Cognito Services
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
