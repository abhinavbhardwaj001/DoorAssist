import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  MapPin,
  Plus,
  Trash2,
  ImagePlus,
  CheckCircle2,
  ArrowUpRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { applyAsProvider } from "../../services/provider.api";
import { useNotification } from "../../context/NotificationContext";
import { getDashboardPathByRole } from "../../utils/authRedirect";

const BecomeProvider = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    experienceYears: "",
    serviceAreas: [{ city: "", state: "" }],
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const dashboardPath = getDashboardPathByRole(user?.role);

  useEffect(() => {
    if (!profileImage) {
      setImagePreview("");
      return;
    }

    const url = URL.createObjectURL(profileImage);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [profileImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAreaChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map((area, i) =>
        i === index ? { ...area, [field]: value } : area,
      ),
    }));
  };

  const addServiceArea = () => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, { city: "", state: "" }],
    }));
  };

  const removeServiceArea = (index) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setProfileImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file.", "error");
      e.target.value = "";
      return;
    }

    setProfileImage(file);
  };

  const clearSelectedImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const experience = Number(formData.experienceYears);

    if (
      formData.experienceYears === "" ||
      !Number.isInteger(experience) ||
      experience < 0 ||
      experience > 60
    ) {
      showNotification(
        "Experience must be a whole number between 0 and 60.",
        "error",
      );
      return;
    }

    const serviceAreas = formData.serviceAreas.map((area) => ({
      city: area.city.trim(),
      state: area.state.trim(),
    }));

    if (
      serviceAreas.length === 0 ||
      serviceAreas.some(
        (area) =>
          area.city.length < 2 ||
          area.state.length < 2 ||
          area.city.length > 100 ||
          area.state.length > 100,
      )
    ) {
      showNotification("Please provide valid city and state details.", "error");
      return;
    }

    const uniqueKeys = new Set(
      serviceAreas.map(
        (area) => `${area.city.toLowerCase()}|${area.state.toLowerCase()}`,
      ),
    );

    if (uniqueKeys.size !== serviceAreas.length) {
      showNotification("Please remove duplicate service areas.", "error");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("businessName", formData.businessName.trim());
      payload.append("description", formData.description.trim());
      payload.append("experienceYears", String(experience));
      payload.append("serviceAreas", JSON.stringify(serviceAreas));

      if (profileImage) {
        payload.append("profileImage", profileImage);
      }

      await applyAsProvider(payload);

      showNotification(
        "Provider application submitted successfully!",
        "success",
      );
      setSuccess(true);
    } catch (err) {
      showNotification(
        err.response?.data?.message ||
          "Unable to submit your application. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-2xl border border-[#bfcaff]/50 bg-white/75 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30";

  if (success) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
        <div
          role="status"
          className="relative w-full max-w-lg overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-8 text-center shadow-[0_12px_45px_rgba(203,189,255,0.22)] backdrop-blur-2xl sm:p-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#e4a5ff]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-[#acdcff]/30 blur-3xl"
          />

          <div className="relative z-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100/90 text-emerald-600 ring-1 ring-inset ring-emerald-200/80 shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Application Submitted!
            </h1>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600 sm:text-base">
              Your provider application has been submitted successfully and is
              now pending admin verification.
            </p>

            <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
              Once approved, you can access the provider dashboard and start
              managing your services.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/provider-application"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
              >
                <span>View Application Status</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                to={dashboardPath}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4 text-[#7c56a8]" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
            <span>Join Our Provider Network</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Become a Service Provider
          </h1>

          <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-slate-500 sm:text-base">
            Apply to offer your services on DoorAssist. Your application will be
            reviewed by an administrator.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="relative space-y-8 overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl sm:p-9"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e4a5ff]/15 blur-3xl"
          />

          {/* Business Information */}
          <section className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  Business Information
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  Tell customers who you are and what you specialize in.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="businessName"
                  className="text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Business Name <span className="text-rose-500">*</span>
                </label>

                <input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Sharma Home Services"
                  minLength={2}
                  maxLength={100}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="text-xs font-bold uppercase tracking-wider text-slate-600"
                  >
                    Business Description (Optional)
                  </label>

                  <span className="text-xs font-semibold text-slate-400">
                    {formData.description.length}/1000
                  </span>
                </div>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell customers about your experience and services..."
                  rows={5}
                  maxLength={1000}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="experienceYears"
                  className="text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Years of Experience <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <Briefcase className="pointer-events-none absolute left-3.5 top-[calc(50%+4px)] h-4 w-4 -translate-y-1/2 text-[#9687c7]" />
                  <input
                    id="experienceYears"
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    min={0}
                    max={60}
                    step={1}
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Service Areas */}
          <section className="relative z-10 border-t border-[#bfcaff]/30 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Service Areas
                  </h2>
                  <p className="text-xs font-medium text-slate-500">
                    Add at least one city and state where you provide services.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addServiceArea}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#bfcaff]/60 bg-white/80 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-linear-to-r hover:from-[#e4a5ff]/20 hover:to-[#acdcff]/20 hover:text-slate-900 active:scale-95 sm:text-sm"
              >
                <Plus className="h-4 w-4 text-[#7c56a8]" />
                <span>Add Area</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {formData.serviceAreas.map((area, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-[#bfcaff]/45 bg-white/60 p-5 shadow-xs backdrop-blur-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/80 px-3 py-1 text-xs font-bold text-slate-700">
                      <MapPin className="h-3 w-3 text-[#7c56a8]" />
                      <span>Service Area {index + 1}</span>
                    </span>

                    {formData.serviceAreas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeServiceArea(index)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-red-600 transition-colors hover:bg-red-50/90 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`city-${index}`}
                        className="text-xs font-bold uppercase tracking-wider text-slate-600"
                      >
                        City <span className="text-rose-500">*</span>
                      </label>

                      <input
                        id={`city-${index}`}
                        value={area.city}
                        onChange={(e) =>
                          handleAreaChange(index, "city", e.target.value)
                        }
                        placeholder="e.g. Dehradun"
                        minLength={2}
                        maxLength={100}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`state-${index}`}
                        className="text-xs font-bold uppercase tracking-wider text-slate-600"
                      >
                        State <span className="text-rose-500">*</span>
                      </label>

                      <input
                        id={`state-${index}`}
                        value={area.state}
                        onChange={(e) =>
                          handleAreaChange(index, "state", e.target.value)
                        }
                        placeholder="e.g. Uttarakhand"
                        minLength={2}
                        maxLength={100}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Profile Image */}
          <section className="relative z-10 border-t border-[#bfcaff]/30 pt-8">
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              Profile Image
            </h2>

            <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
              Upload an optional business or provider profile image.
            </p>

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/80 bg-linear-to-br from-[#f6ebff] via-[#f4f1ff] to-[#ebf6ff] shadow-[0_6px_20px_rgba(203,189,255,0.22)]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Selected provider profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-[#8b7cc8] shadow-xs backdrop-blur-xl">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="profileImage"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Choose Image
                </label>

                <input
                  ref={fileInputRef}
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-xs font-medium text-slate-600 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-linear-to-r file:from-[#e4a5ff] file:via-[#cbbdff] file:to-[#acdcff] file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-slate-900 file:shadow-xs file:transition-all hover:file:brightness-105 sm:text-sm"
                />

                {profileImage && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold text-[#7c56a8]">
                      Selected: {profileImage.name}
                    </p>
                    <button
                      type="button"
                      onClick={clearSelectedImage}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
                    >
                      <X className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Submission */}
          <div className="relative z-10 border-t border-[#bfcaff]/30 pt-8">
            <p className="mb-5 text-xs font-medium leading-6 text-slate-500 sm:text-sm">
              Your application will be reviewed by the DoorAssist admin team.
              You can create and manage services after your application is
              approved.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-7 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {loading ? "Submitting Application..." : "Submit Application"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeProvider;
