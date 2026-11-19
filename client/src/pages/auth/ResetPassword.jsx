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
            Reset Password
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            If an account exists, enter the 6-digit OTP sent to your email and
            create a new password.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-[#0a1128]"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-[#64748b]" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-[#d8e2eb] bg-[#f1f5f9] py-3 pl-12 pr-4 text-sm font-medium text-[#33415c] outline-none"
              />
            </div>
          </div>

          {/* OTP */}
          <div>
            <label
              htmlFor="otp"
              className="mb-1.5 block text-sm font-semibold text-[#0a1128]"
            >
              Password Reset OTP
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Key className="h-5 w-5 text-[#33415c] transition-colors group-focus-within:text-[#1282a2]" />
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
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3 pl-12 pr-4 text-lg font-bold tracking-[0.25em] text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1.5 block text-sm font-semibold text-[#0a1128]"
            >
              New Password
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-[#33415c] transition-colors group-focus-within:text-[#1282a2]" />
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
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3 pl-12 pr-12 text-sm text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center p-2 text-[#33415c] transition-colors hover:text-[#0a1128]"
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
              className="mb-1.5 block text-sm font-semibold text-[#0a1128]"
            >
              Confirm New Password
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-[#33415c] transition-colors group-focus-within:text-[#1282a2]" />
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
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3 pl-12 pr-12 text-sm text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-60"
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

        <div className="mt-7 text-center text-sm font-medium text-[#33415c]">
          <p>Didn&apos;t receive the OTP, or has it expired?</p>
          <Link
            to="/forgot-password"
            className="mt-1.5 inline-block font-bold text-[#034078] underline decoration-[#1282a2] decoration-2 underline-offset-4 transition-colors hover:text-[#1282a2]"
          >
            Request a New OTP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
