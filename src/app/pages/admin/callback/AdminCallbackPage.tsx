import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";

const AdminCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initiatedRef = useRef(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const code = searchParams.get("code");

  useEffect(() => {
    if (initiatedRef.current) return;

    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const redirectUri = window.location.origin + "/admin";

    if (!cognitoDomain || !clientId) {
      setErrorMsg("Missing Cognito environment configurations (VITE_COGNITO_DOMAIN or VITE_COGNITO_CLIENT_ID).");
      return;
    }

    if (code) {
      initiatedRef.current = true;

      const exchangeCode = async () => {
        try {
          const response = await fetch(`${cognitoDomain}/oauth2/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: clientId,
              code: code,
              redirect_uri: redirectUri,
            }),
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error_description || errData.error || "Failed to exchange authorization code.");
          }

          const data = await response.json();
          console.log(data);
          // Store the tokens in localStorage
          localStorage.setItem("admin_token", data.id_token || data.access_token);

          // Redirect to the admin dashboard
          navigate("/admin/dashboard", { replace: true });
        } catch (error: any) {
          setErrorMsg(error.message || "An error occurred during authentication.");
        }
      };

      exchangeCode();
    } else {
      // If there is no code in the URL, redirect to admin login page
      navigate("/admin/login", { replace: true });
    }
  }, [code, navigate]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-stone-50 bg-linear-to-b from-stone-50/50 to-emerald-50/10 p-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200/60 bg-white/75 p-8 shadow-2xl shadow-emerald-950/5 backdrop-blur-xl transition-all duration-300">
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <div className="mb-8 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-emerald-950 shadow-md shadow-emerald-950/20">
              <span className="text-xl font-black text-emerald-50 animate-pulse">T</span>
            </span>
          </div>

          {!errorMsg ? (
            <div className="space-y-6">
              <div className="relative flex items-center justify-center py-4">
                <div className="absolute h-20 w-20 animate-ping rounded-full bg-emerald-50/70 duration-1000" />
                <div className="absolute h-14 w-14 animate-pulse rounded-full bg-emerald-100/50" />
                <Loader2 className="relative h-10 w-10 animate-spin text-emerald-800" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Securing Session
                </h2>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Exchanging secure keys with AWS Cognito to authorize your Admin dashboard session.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-full bg-emerald-50/50 border border-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>SSL Secured AWS Cognito Session</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-500 shadow-xs">
                <AlertCircle className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Authentication Failed
                </h2>
                <p className="text-sm text-slate-500 max-w-sm">
                  {errorMsg}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    initiatedRef.current = false;
                    setErrorMsg(null);
                    window.location.reload();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-emerald-950 py-3 text-sm font-semibold uppercase tracking-wider text-emerald-50 shadow-md shadow-emerald-950/10 hover:opacity-95 cursor-pointer transition-all"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCallbackPage;
