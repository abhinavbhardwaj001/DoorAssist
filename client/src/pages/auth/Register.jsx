import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone } from "lucide-react";
import { registerUser } from "../../services/auth.api";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      };

      await registerUser(payload);

      navigate("/verify-email", {
        replace: true,
        state: {
          email: payload.email,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#b8d0ff] border-t-[#e4a5ff]"></div>
      </div>
    );
  }

  if (user) {
    const dashboard =
      user.role === "admin"
        ? "/admin"
        : user.role === "provider"
          ? "/provider/dashboard"
          : "/dashboard";

    return <Navigate to={dashboard} replace />;
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
            Create your account
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Join DoorAssist and discover trusted local services.
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Full Name
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <User className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-[#d1b7ff]" />
              </div>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                minLength={2}
                maxLength={50}
                required
                className="w-full rounded-xl border-2 border-[#bfcaff]/40 bg-white/60 py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#deabff] focus:bg-white focus:ring-4 focus:ring-[#deabff]/20"
              />
            </div>
          </div>

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
                <Mail className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-[#d1b7ff]" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                maxLength={254}
                required
                className="w-full rounded-xl border-2 border-[#bfcaff]/40 bg-white/60 py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#deabff] focus:bg-white focus:ring-4 focus:ring-[#deabff]/20"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Phone Number
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Phone className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-[#d1b7ff]" />
              </div>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                autoComplete="tel-national"
                inputMode="numeric"
                pattern="[6-9][0-9]{9}"
                title="Enter a valid 10-digit Indian mobile number"
                maxLength={10}
                required
                className="w-full rounded-xl border-2 border-[#bfcaff]/40 bg-white/60 py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#deabff] focus:bg-white focus:ring-4 focus:ring-[#deabff]/20"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-[#d1b7ff]" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
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
              Confirm Password
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
                placeholder="Re-enter your password"
                autoComplete="new-password"
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
              "Creating account..."
            ) : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
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

export default Register;
