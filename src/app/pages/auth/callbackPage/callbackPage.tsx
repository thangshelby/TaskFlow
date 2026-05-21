import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@libs/hooks/apis/useAuth";
import { Loader2, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";

const CallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();
  const initiatedRef = useRef(false);

  const code = searchParams.get("code");
  const state = searchParams.get("state") || "";

  useEffect(() => {
    if (initiatedRef.current) return;

    if (code) {
      initiatedRef.current = true;

      // Handle GitHub connection inside the Development Tab (state === "taskflow")
      if (state === "taskflow") {
        localStorage.setItem("tf_github_connected", "true");
        const callbackPath = localStorage.getItem("tf_github_callback_path") || "/projects";
        localStorage.removeItem("tf_github_callback_path");
        navigate(`${callbackPath}?status=success`, { replace: true });
        return;
      }

      const provider = state.toLowerCase().includes("google") ? "google" : "github";
      const redirectUri = window.location.origin + "/auth/callback";

      oauthLogin.mutate({
        code,
        provider,
        redirect_uri: redirectUri,
      });
    }
  }, [code, state, oauthLogin, navigate]);

  const isError = oauthLogin.isError;
  const errorMsg = oauthLogin.error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? ((oauthLogin.error as any).response?.data?.message || oauthLogin.error.message || "Failed to authenticate with provider.")
    : null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-stone-50 bg-linear-to-b from-stone-50/50 to-emerald-50/10 p-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200/60 bg-white/75 p-8 shadow-2xl shadow-emerald-950/5 backdrop-blur-xl transition-all duration-300">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          {/* Brand Logo Header */}
          <div className="mb-8 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-emerald-950 shadow-md shadow-emerald-950/20">
              <span className="text-xl font-black text-emerald-50 animate-pulse">T</span>
            </span>
          </div>

          {!isError ? (
            <div className="space-y-6">
              {/* Loader with spinning effect and animated concentric rings */}
              <div className="relative flex items-center justify-center py-4">
                <div className="absolute h-20 w-20 animate-ping rounded-full bg-emerald-50/70 duration-1000" />
                <div className="absolute h-14 w-14 animate-pulse rounded-full bg-emerald-100/50" />
                <Loader2 className="relative h-10 w-10 animate-spin text-emerald-800" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Authenticating
                </h2>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Exchanging secure tokens with{" "}
                  <span className="font-semibold text-slate-700 capitalize">
                    {state.toLowerCase().includes("google") ? "Google" : "GitHub"}
                  </span>{" "}
                  to authorize your workspace session.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-full bg-emerald-50/50 border border-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>SSL Secured Callback Session</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Animated Error Emblem */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-500 shadow-xs">
                <AlertCircle className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Authentication Failed
                </h2>
                <p className="text-sm text-slate-500 max-w-sm">
                  {errorMsg || "An unexpected error occurred during the OAuth authentication process."}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    initiatedRef.current = false;
                    window.location.reload();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-emerald-950 py-3 text-sm font-semibold uppercase tracking-wider text-emerald-50 shadow-md shadow-emerald-950/10 hover:opacity-95 cursor-pointer transition-all"
                >
                  Retry Connection
                </button>
                
                <Link
                  to="/auth/login"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallbackPage;
