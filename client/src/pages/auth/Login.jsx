import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, user, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getDashboardPath = (role) => {
    if (role === "admin") return "/admin";
    if (role === "provider") return "/provider/dashboard";
    return "/dashboard";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await login(formData);

      const role = response.data.user.role;
      const destination =
        location.state?.from?.pathname || getDashboardPath(role);

      navigate(destination, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to login. Please try again.";

      setError(message);
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
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      
      <div className="absolute -left-16 -top-16 h-125 w-125 rounded-full bg-[#e4a5ff] opacity-30 blur-[100px]"></div>
      <div className="absolute -bottom-16 -right-16 h-125 w-125 rounded-full bg-[#acdcff] opacity-40 blur-[100px]"></div>
      <div className="absolute left-1/4 top-1/2 h-80 w-80 rounded-full bg-[#cbbdff] opacity-20 blur-[80px]"></div>

      <div className="relative z-10 w-full max-w-md rounded-4xl border border-white/60 bg-white/70 p-8 shadow-[0_8px_40px_rgba(203,189,255,0.15)] backdrop-blur-2xl sm:p-10">
        {/* Heading */}
        <div className="mb-10 text-center">
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight text-slate-800 transition-colors hover:text-slate-600"
          >
            DoorAssist
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-slate-800">
            Welcome back
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Sign in to manage your services and bookings.
          </p>
        </div>

        {/* Success Message */}
        {location.state?.message && !error && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-xl border border-[#b2d6ff]/50 bg-[#b2d6ff]/20 px-4 py-3.5 text-sm font-medium text-slate-700"
          >
            <div className="h-2 w-2 rounded-full bg-[#acdcff] shadow-[0_0_8px_#acdcff]"></div>
            {location.state.message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm font-medium text-red-600 backdrop-blur-sm"
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email address
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
                required
                className="w-full rounded-xl border-2 border-[#bfcaff]/40 bg-white/60 py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#deabff] focus:bg-white focus:ring-4 focus:ring-[#deabff]/20"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                state={{ fromLogin: true }}
                className="text-sm font-semibold text-slate-500 underline decoration-[#d8b1ff] decoration-2 underline-offset-4 transition-colors hover:text-slate-800"
              >
                Forgot password?
              </Link>
            </div>

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
                placeholder="Enter your password"
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={loading}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.02] hover:shadow-[#cbbdff]/50 hover:brightness-105 disabled:pointer-events-none disabled:opacity-70"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-slate-800 underline decoration-[#b2d6ff] decoration-2 underline-offset-4 transition-all hover:text-slate-600"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
