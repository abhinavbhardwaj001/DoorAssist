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
      <div className="flex min-h-screen items-center justify-center bg-[#fefcfb]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d8e2eb] border-t-[#034078]"></div>
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
            Create your account
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            Join DoorAssist and discover trusted local services.
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-semibold text-[#0a1128]"
            >
              Full Name
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <User className="h-5 w-5 text-[#33415c] transition-colors group-focus-within:text-[#1282a2]" />
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
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3 pl-12 pr-4 text-sm text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
              />
            </div>
          </div>

          {/* Email */}
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                maxLength={254}
                required
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3 pl-12 pr-4 text-sm text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-semibold text-[#0a1128]"
            >
              Phone Number
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Phone className="h-5 w-5 text-[#33415c] transition-colors group-focus-within:text-[#1282a2]" />
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
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3 pl-12 pr-4 text-sm text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-[#0a1128]"
            >
              Password
            </label>
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
              Confirm Password
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
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] py-3 pl-12 pr-4 text-sm text-[#0a1128] placeholder-[#64748b] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-60"
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

        <p className="mt-7 text-center text-sm font-medium text-[#33415c]">
          Already have an account?{" "}
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

export default Register;
