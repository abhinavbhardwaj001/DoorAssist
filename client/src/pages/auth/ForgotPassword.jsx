import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

import { forgotPassword } from "../../services/auth.api";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const normalizedEmail = email.trim().toLowerCase();

      await forgotPassword({ email: normalizedEmail });

      navigate("/reset-password", {
        replace: true,
        state: { email: normalizedEmail },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to process your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!location.state?.fromLogin) {
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
            Forgot Password?
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            Enter your registered email address. If an account exists,
            we&apos;ll send you a password reset code.
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

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-[#0a1128]"
            >
              Email Address
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-[#33415c] transition-colors group-focus-within:text-[#1282a2]" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter your registered email"
                autoComplete="email"
                maxLength={254}
                required
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3.5 pl-12 pr-4 text-sm text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? (
              "Sending OTP..."
            ) : (
              <>
                Send Reset OTP
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-[#33415c]">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-bold text-[#034078] underline decoration-[#1282a2] decoration-2 underline-offset-4 transition-colors hover:text-[#1282a2]"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
