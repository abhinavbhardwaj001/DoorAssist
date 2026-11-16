import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Key, Eye, EyeOff, ArrowRight } from "lucide-react";

import { resetPassword } from "../../services/auth.api";
import { useNotification } from "../../context/NotificationContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "otp" ? value.replace(/\D/g, "").slice(0, 6) : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!/^\d{6}$/.test(formData.otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }

    if (formData.newPassword.length > 72) {
      setError("Password must not exceed 72 characters");
      return;
    }

    if (!formData.newPassword.trim()) {
      setError("Password cannot contain only spaces");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPassword({
        email: formData.email.trim().toLowerCase(),
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      showNotification(
        "Password reset successfully. Please log in with your new password.",
        "success",
      );

      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!location.state?.email) {
    return <Navigate to="/login" replace />;
  }

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
            Reset Password
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            If an account exists, enter the 6-digit OTP sent to your email and
            create a new password.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm font-medium text-red-600 backdrop-blur-sm"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border-2 border-[#bfcaff]/20 bg-white/40 py-3.5 pl-12 pr-4 text-sm text-slate-500 outline-none"
              />
            </div>
          </div>

          {/* OTP */}
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password Reset OTP
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Key className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-[#d1b7ff]" />
              </div>
              <input
                id="otp"
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="6-digit OTP"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                className="w-full rounded-xl border-2 border-[#bfcaff]/40 bg-white/60 py-3.5 pl-12 pr-4 text-lg font-semibold tracking-[0.2em] text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#deabff] focus:bg-white focus:ring-4 focus:ring-[#deabff]/20"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              New Password
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-[#d1b7ff]" />
              </div>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                className="w-full rounded-xl border-2 border-[#bfcaff]/40 bg-white/60 py-3.5 pl-12 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#deabff] focus:bg-white focus:ring-4 focus:ring-[#deabff]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center p-2 text-slate-400 transition-colors hover:text-[#d1b7ff]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Confirm New Password
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-[#d1b7ff]" />
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border-2 border-[#bfcaff]/40 bg-white/60 py-3.5 pl-12 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#deabff] focus:bg-white focus:ring-4 focus:ring-[#deabff]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.02] hover:shadow-[#cbbdff]/50 hover:brightness-105 disabled:pointer-events-none disabled:opacity-70"
          >
            {loading ? (
              "Resetting Password..."
            ) : (
              <>
                Reset Password
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          <p>Didn't receive the OTP, or has it expired?</p>
          <Link
            to="/forgot-password"
            className="mt-2 inline-block font-bold text-slate-800 underline decoration-[#b2d6ff] decoration-2 underline-offset-4 transition-all hover:text-slate-600"
          >
            Request a New OTP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
