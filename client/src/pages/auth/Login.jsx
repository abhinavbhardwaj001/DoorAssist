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
      <div className="flex min-h-screen items-center justify-center bg-[#fefcfb]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d8e2eb] border-t-[#034078]"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
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
            Welcome back
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            Sign in to manage your services and bookings.
          </p>
        </div>

        {/* Success Message */}
        {location.state?.message && !error && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-xl border border-[#1282a2]/30 bg-[#1282a2]/10 px-4 py-3.5 text-sm font-semibold text-[#0a1128]"
          >
            <div className="h-2 w-2 shrink-0 rounded-full bg-[#1282a2]"></div>
            {location.state.message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-[#0a1128]"
            >
              Email address
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-[#33415c] transition-colors group-focus-within:text-[#1282a2]" />
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
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3.5 pl-12 pr-4 text-sm text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-[#0a1128]"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                state={{ fromLogin: true }}
                className="text-sm font-semibold text-[#1282a2] transition-colors hover:text-[#034078] hover:underline hover:underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-[#33415c] transition-colors group-focus-within:text-[#1282a2]" />
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
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3.5 pl-12 pr-12 text-sm text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
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

          <button
            type="submit"
            disabled={loading}
            className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-60"
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

        <p className="mt-8 text-center text-sm font-medium text-[#33415c]">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-[#034078] underline decoration-[#1282a2] decoration-2 underline-offset-4 transition-colors hover:text-[#1282a2]"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
