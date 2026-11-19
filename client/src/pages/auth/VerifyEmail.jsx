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
    <div className="flex min-h-screen items-center justify-center bg-[#fefcfb] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#d8e2eb] bg-white p-8 shadow-sm sm:p-10">
        {/* Heading */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tight text-[#0a1128] transition-colors hover:text-[#034078]"
          >
            <span>DoorAssist</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#1282a2]" />
          </Link>

          <h1 className="mt-5 text-2xl font-bold text-[#0a1128]">
            Verify your email
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            Enter the 6-digit verification code sent to your email.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-xl border border-[#1282a2]/30 bg-[#1282a2]/10 px-4 py-3.5 text-sm font-semibold text-[#0a1128]"
          >
            <div className="h-2 w-2 shrink-0 rounded-full bg-[#1282a2]"></div>
            {success}
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-[#0a1128]"
            >
              Email Address
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail
                  className={`h-5 w-5 ${
                    emailFromRegistration
                      ? "text-[#64748b]"
                      : "text-[#33415c] transition-colors group-focus-within:text-[#1282a2]"
                  }`}
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
                className={`w-full rounded-xl border py-3.5 pl-12 pr-4 text-sm outline-none transition-all ${
                  emailFromRegistration
                    ? "cursor-not-allowed border-[#d8e2eb] bg-[#f1f5f9] font-medium text-[#33415c]"
                    : "border-[#cbd5e1] bg-[#fefcfb] text-[#0a1128] placeholder-[#64748b] focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="otp"
              className="mb-1.5 block text-sm font-semibold text-[#0a1128]"
            >
              Verification Code
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Key className="h-5 w-5 text-[#33415c] transition-colors group-focus-within:text-[#1282a2]" />
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
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3.5 pl-12 pr-4 text-lg font-bold tracking-[0.25em] text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || resending}
            className="group mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-60"
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
          <p className="text-sm font-medium text-[#33415c]">
            Didn&apos;t receive the code?
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending || loading}
            className="mt-1.5 cursor-pointer text-sm font-bold text-[#034078] underline decoration-[#1282a2] decoration-2 underline-offset-4 transition-colors hover:text-[#1282a2] disabled:cursor-not-allowed disabled:text-[#64748b] disabled:no-underline"
          >
            {resending
              ? "Sending..."
              : cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : "Resend OTP"}
          </button>
        </div>

        <p className="mt-7 text-center text-sm font-medium text-[#33415c]">
          Already verified?{" "}
          <Link
            to="/login"
            className="font-bold text-[#034078] underline decoration-[#1282a2] decoration-2 underline-offset-4 transition-colors hover:text-[#1282a2]"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
