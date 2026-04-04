import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@libs/app/components/general-components/button";
import { useAuth } from "@libs/hooks/apis/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@libs/store";
import { setError } from "@libs/store/slices/authSlice";
import { AuthScaffold } from "@libs/app/components/auth/auth-scaffold";
import { CheckCircle2, KeyRound, XCircle } from "lucide-react";

const OTP_LENGTH = 6;

const emptyCells = (): string[] => Array.from({ length: OTP_LENGTH }, () => "");

const VerifyPage: React.FC = () => {
  const [cells, setCells] = useState<string[]>(emptyCells);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resendBanner, setResendBanner] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const { email } = (location.state as { email?: string } | undefined) || {};

  const { verifyOtp, resendOtp } = useAuth();
  const isLoading = verifyOtp.isPending;
  const isResending = resendOtp.isPending;
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
  }, [countdown]);

  const focusIndex = (i: number) => {
    inputsRef.current[i]?.focus();
    inputsRef.current[i]?.select();
  };

  const setDigitAt = (index: number, raw: string) => {
    setLocalError(null);
    dispatch(setError(null));
    setResendBanner(false);

    setCells((prev) => {
      const next = [...prev];
      if (raw === "") {
        next[index] = "";
        return next;
      }
      const digit = raw.replace(/\D/g, "").slice(-1);
      if (!digit) return prev;
      next[index] = digit;
      return next;
    });

    if (raw !== "") {
      const digit = raw.replace(/\D/g, "").slice(-1);
      if (digit && index < OTP_LENGTH - 1) {
        focusIndex(index + 1);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!cells[index] && index > 0) {
        e.preventDefault();
        focusIndex(index - 1);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusIndex(index - 1);
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setLocalError(null);
    dispatch(setError(null));
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    setCells(() => {
      const next = emptyCells();
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i] ?? "";
      }
      return next;
    });
    const nextFocus = Math.min(Math.max(pasted.length - 1, 0), OTP_LENGTH - 1);
    requestAnimationFrame(() => focusIndex(nextFocus));
  };

  const handleVerifyOtp = () => {
    const code = cells.join("");
    if (code.length !== OTP_LENGTH || cells.some((c) => !c)) {
      setLocalError("Please enter all 6 OTP digits");
      return;
    }
    if (!email) return;

    setLocalError(null);
    dispatch(setError(null));
    verifyOtp.mutate({ otp: code, email });
  };

  const handleResendOtp = async () => {
    if (!canResend || !email) return;
    setResendBanner(false);
    dispatch(setError(null));
    try {
      await resendOtp.mutateAsync({ email });
      setCountdown(60);
      setCanResend(false);
      setCells(emptyCells());
      setResendBanner(true);
    } catch {
      // Hook / API may set Redux error; keep a fallback
      setLocalError("Could not resend OTP. Please try again.");
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!email) {
    return (
      <AuthScaffold
        title="Almost there"
        subtitle="We could not find your signup email. Start registration again to receive a verification code."
        showSocialLogin={false}
        bottom={
          <p className="text-center text-sm text-slate-600">
            <Link to="/auth/register" className="font-semibold text-emerald-800 hover:underline">
              Back to sign up
            </Link>
            {" · "}
            <Link to="/auth/login" className="font-semibold text-emerald-800 hover:underline">
              Sign in
            </Link>
          </p>
        }
      >
        <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-900">
            Open the registration page and submit the form again so we can send a code to your email.
          </p>
        </div>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      title="Verify your email"
      subtitle={
        <>
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-slate-800">{email}</span>. Enter it below to finish signing
          up.
        </>
      }
      showSocialLogin={false}
      bottom={
        <p className="text-center text-sm text-slate-600">
          Wrong inbox?{" "}
          <Link to="/auth/register" className="font-semibold text-emerald-800 hover:underline">
            Use a different email
          </Link>
          {" · "}
          <Link to="/auth/login" className="font-semibold text-emerald-800 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        {resendBanner && (
          <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
              <p className="text-sm text-emerald-800">
                A new OTP has been sent. Please check your inbox.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {localError && !error && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <p className="text-sm text-red-800">{localError}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-6">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            <KeyRound className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            Verification code
          </label>
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                maxLength={1}
                value={cells[index] ?? ""}
                onChange={(e) => setDigitAt(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-12 w-10 rounded-sm border-0 bg-white text-center text-lg font-semibold tabular-nums text-slate-900 shadow-sm ring-1 ring-slate-200 transition placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:h-14 sm:w-11 sm:text-xl"
              />
            ))}
          </div>
        </div>

        <div className="pt-1">
          <Button
            variant="primary"
            isLoading={isLoading}
            type="button"
            onClick={handleVerifyOtp}
            disabled={cells.some((c) => !c)}
            className="w-full rounded-sm! bg-linear-to-br from-emerald-950 to-emerald-800 py-3 font-semibold uppercase tracking-wide shadow-lg shadow-emerald-900/10 hover:opacity-95 disabled:opacity-60"
          >
            Verify & continue
          </Button>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-sm text-slate-600">Didn't get the code?</p>
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending ? "Sending…" : "Resend code"}
            </button>
          ) : (
            <p className="text-sm text-slate-500">
              Resend in{" "}
              <span className="font-mono font-semibold text-emerald-800">{formatTime(countdown)}</span>
            </p>
          )}
        </div>

        <div className="text-center">
          <Link
            to="/auth/login"
            className="text-sm font-semibold text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </AuthScaffold>
  );
};

export default VerifyPage;
