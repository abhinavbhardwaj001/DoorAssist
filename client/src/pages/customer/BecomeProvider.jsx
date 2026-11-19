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
    "mt-2 w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] px-4 py-3 text-sm font-medium text-[#0a1128] placeholder:text-[#64748b] transition-all outline-none focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20";

  if (success) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#fefcfb] px-4 py-12">
        <div
          role="status"
          className="w-full max-w-lg rounded-3xl border border-[#d8e2eb] bg-white p-8 text-center shadow-sm sm:p-10"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
            Application Submitted!
          </h1>

          <p className="mt-3 text-sm font-medium leading-7 text-[#33415c] sm:text-base">
            Your provider application has been submitted successfully and is now
            pending admin verification.
          </p>

          <p className="mt-2 text-xs font-medium text-[#64748b] sm:text-sm">
            Once approved, you can access the provider dashboard and start
            managing your services.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/provider-application"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
            >
              <span>View Application Status</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              to={dashboardPath}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-6 py-3.5 text-sm font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
            >
              <ArrowLeft className="h-4 w-4 text-[#1282a2]" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 rounded-3xl border border-[#d8e2eb] bg-white p-7 shadow-xs sm:p-9">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
            <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
            <span>Join Our Provider Network</span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
            Become a Service Provider
          </h1>

          <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#33415c] sm:text-base">
            Apply to offer your services on DoorAssist. Your application will be
            reviewed by an administrator.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-9"
        >
          {/* Business Information */}
          <section>
            <div className="flex items-center gap-3 border-b border-[#e2e8f0] pb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-[#0a1128] sm:text-xl">
                  Business Information
                </h2>
                <p className="text-xs font-medium text-[#33415c]">
                  Tell customers who you are and what you specialize in.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="businessName"
                  className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                >
                  Business Name <span className="text-red-600">*</span>
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
                    className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                  >
                    Business Description (Optional)
                  </label>

                  <span className="text-xs font-semibold text-[#64748b]">
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
                  className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                >
                  Years of Experience <span className="text-red-600">*</span>
                </label>

                <div className="relative">
                  <Briefcase className="pointer-events-none absolute left-3.5 top-[calc(50%+4px)] h-4 w-4 -translate-y-1/2 text-[#1282a2]" />
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
          <section className="border-t border-[#e2e8f0] pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-[#0a1128] sm:text-xl">
                    Service Areas
                  </h2>
                  <p className="text-xs font-medium text-[#33415c]">
                    Add at least one city and state where you provide services.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addServiceArea}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] sm:text-sm"
              >
                <Plus className="h-4 w-4 text-[#1282a2]" />
                <span>Add Area</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {formData.serviceAreas.map((area, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8e2eb] bg-white px-3 py-1 text-xs font-bold text-[#034078]">
                      <MapPin className="h-3 w-3 text-[#1282a2]" />
                      <span>Service Area {index + 1}</span>
                    </span>

                    {formData.serviceAreas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeServiceArea(index)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
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
                        className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                      >
                        City <span className="text-red-600">*</span>
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
                        className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                      >
                        State <span className="text-red-600">*</span>
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
          <section className="border-t border-[#e2e8f0] pt-8">
            <h2 className="text-lg font-extrabold text-[#0a1128] sm:text-xl">
              Profile Image
            </h2>

            <p className="mt-1 text-xs font-medium text-[#33415c] sm:text-sm">
              Upload an optional business or provider profile image.
            </p>

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d8e2eb] bg-[#f4f7fa]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Selected provider profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d8e2eb] bg-white text-[#034078]">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="profileImage"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                >
                  Choose Image
                </label>

                <input
                  ref={fileInputRef}
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-xs font-medium text-[#33415c] file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-[#034078] file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-white file:transition-colors hover:file:bg-[#001f54] sm:text-sm"
                />

                {profileImage && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold text-[#034078]">
                      Selected: {profileImage.name}
                    </p>
                    <button
                      type="button"
                      onClick={clearSelectedImage}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 transition-colors hover:bg-red-100"
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
          <div className="border-t border-[#e2e8f0] pt-8">
            <p className="mb-5 text-xs font-medium leading-6 text-[#33415c] sm:text-sm">
              Your application will be reviewed by the DoorAssist admin team.
              You can create and manage services after your application is
              approved.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-7 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
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
