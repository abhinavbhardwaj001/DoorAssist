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
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Enter your registered email address. If an account exists, we'll
            send you a password reset code.
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

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-[#d1b7ff]" />
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
                className="w-full rounded-xl border-2 border-[#bfcaff]/40 bg-white/60 py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#deabff] focus:bg-white focus:ring-4 focus:ring-[#deabff]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.02] hover:shadow-[#cbbdff]/50 hover:brightness-105 disabled:pointer-events-none disabled:opacity-70"
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

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-bold text-slate-800 underline decoration-[#b2d6ff] decoration-2 underline-offset-4 transition-all hover:text-slate-600"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
