import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Key, ArrowRight } from "lucide-react";

import { verifyEmail, resendVerificationOtp } from "../../services/auth.api";
import { useNotification } from "../../context/NotificationContext";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();

  const [email, setEmail] = useState(location.state?.email || "");
  const emailFromRegistration = Boolean(location.state?.email);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(location.state?.email ? 60 : 0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Resend OTP countdown
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await verifyEmail({
        email: email.trim().toLowerCase(),
        otp,
      });

      setSuccess("Email verified successfully!");

      showNotification(
        "Email verified successfully. Please log in.",
        "success",
      );

      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || cooldown > 0) return;

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setResending(true);
    setError("");
    setSuccess("");

    try {
      await resendVerificationOtp({
        email: email.trim().toLowerCase(),
      });

      setSuccess("A new OTP has been sent to your email.");
      setCooldown(60);
      setOtp("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend OTP. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      
      <div className="absolute -left-16 -top-16 h-125 w-125 rounded-full bg-[#e4a5ff] opacity-30 blur-[100px]"></div>
      <div className="absolute -bottom-16 -right-16 h-125 w-125 rounded-full bg-[#acdcff] opacity-40 blur-[100px]"></div>
      <div className="absolute left-1/4 top-1/2 h-80 w-80 rounded-full bg-[#cbbdff] opacity-20 blur-[80px]"></div>

      <div className="relative z-10 w-full max-w-md rounded-4xl border border-white/60 bg-white/70 p-8 shadow-[0_8px_40px_rgba(203,189,255,0.15)] backdrop-blur-2xl sm:p-10">
        {/* Heading */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight text-slate-800 transition-colors hover:text-slate-600"
          >
            DoorAssist
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-slate-800">
            Verify your email
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Enter the 6-digit verification code sent to your email.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm font-medium text-red-600 backdrop-blur-sm"
          >
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-xl border border-[#b2d6ff]/50 bg-[#b2d6ff]/20 px-4 py-3.5 text-sm font-medium text-slate-700"
          >
            <div className="h-2 w-2 rounded-full bg-[#acdcff] shadow-[0_0_8px_#acdcff]"></div>
            {success}
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail
                  className={`h-5 w-5 ${emailFromRegistration ? "text-slate-400" : "text-slate-400 transition-colors group-focus-within:text-[#d1b7ff]"}`}
                />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setSuccess("");
                  setCooldown(0);
                }}
                placeholder="Enter your registered email"
                autoComplete="email"
                readOnly={emailFromRegistration}
                required
                className={`w-full rounded-xl border-2 py-3.5 pl-12 pr-4 text-sm outline-none transition-all ${
                  emailFromRegistration
                    ? "cursor-not-allowed border-[#bfcaff]/20 bg-white/40 text-slate-500"
                    : "border-[#bfcaff]/40 bg-white/60 text-slate-800 placeholder-slate-400 focus:border-[#deabff] focus:bg-white focus:ring-4 focus:ring-[#deabff]/20"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Verification Code
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Key className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-[#d1b7ff]" />
              </div>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setOtp(value.slice(0, 6));
                  setError("");
                }}
                placeholder="Enter 6-digit OTP"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                className="w-full rounded-xl border-2 border-[#bfcaff]/40 bg-white/60 py-3.5 pl-12 pr-4 text-lg font-semibold tracking-[0.2em] text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#deabff] focus:bg-white focus:ring-4 focus:ring-[#deabff]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || resending}
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.02] hover:shadow-[#cbbdff]/50 hover:brightness-105 disabled:pointer-events-none disabled:opacity-70"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Verify Email
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-slate-500">
            Didn't receive the code?
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending || loading}
            className="mt-2 text-sm font-bold text-slate-800 underline decoration-[#b2d6ff] decoration-2 underline-offset-4 transition-all hover:text-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
          >
            {resending
              ? "Sending..."
              : cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : "Resend OTP"}
          </button>
        </div>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Already verified?{" "}
          <Link
            to="/login"
            className="font-bold text-slate-800 underline decoration-[#b2d6ff] decoration-2 underline-offset-4 transition-all hover:text-slate-600"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
