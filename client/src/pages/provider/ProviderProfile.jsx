import { useCallback, useEffect, useState } from "react";
import {
  Store,
  Briefcase,
  MapPin,
  FileText,
  ImagePlus,
  Plus,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  getMyProviderProfile,
  updateMyProviderProfile,
} from "../../services/provider.api";
import { useNotification } from "../../context/NotificationContext";
import { formatLabel } from "../../utils/formatters";
import BookingStatusBadge from "../../components/common/BookingStatusBadge";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const createArea = () => ({
  id: crypto.randomUUID(),
  city: "",
  state: "",
});

const ProviderProfile = () => {
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    experienceYears: "",
    serviceAreas: [createArea()],
  });

  const [provider, setProvider] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setFetchError("");

    try {
      const response = await getMyProviderProfile();
      const data = response.data.data.provider;

      setProvider(data);
      setFormData({
        businessName: data.businessName || "",
        description: data.description || "",
        experienceYears: String(data.experienceYears ?? 0),
        serviceAreas: data.serviceAreas?.length
          ? data.serviceAreas.map((area) => ({
              id: crypto.randomUUID(),
              city: area.city,
              state: area.state,
            }))
          : [createArea()],
      });
    } catch (err) {
      setFetchError(
        err.response?.data?.message || "Unable to load your provider profile.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!profileImage) {
      setImagePreview(provider?.profileImage || "");
      return;
    }

    const url = URL.createObjectURL(profileImage);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [profileImage, provider?.profileImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateArea = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map((area) =>
        area.id === id ? { ...area, [field]: value } : area,
      ),
    }));
  };

  const addArea = () => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, createArea()],
    }));
  };

  const removeArea = (id) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((area) => area.id !== id),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file.", "error");
      e.target.value = "";
      return;
    }

    setProfileImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const businessName = formData.businessName.trim();
    const description = formData.description.trim();
    const experience = Number(formData.experienceYears);

    const serviceAreas = formData.serviceAreas.map((area) => ({
      city: area.city.trim(),
      state: area.state.trim(),
    }));

    if (businessName.length < 2 || businessName.length > 100) {
      showNotification("Business name must be 2–100 characters.", "error");
      return;
    }

    if (description.length > 1000) {
      showNotification("Description cannot exceed 1000 characters.", "error");
      return;
    }

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

    if (
      serviceAreas.length === 0 ||
      serviceAreas.some(
        (area) =>
          area.city.length < 2 ||
          area.city.length > 100 ||
          area.state.length < 2 ||
          area.state.length > 100,
      )
    ) {
      showNotification("Add at least one valid city and state.", "error");
      return;
    }

    const payload = new FormData();

    payload.append("businessName", businessName);
    payload.append("description", description);
    payload.append("experienceYears", String(experience));
    payload.append("serviceAreas", JSON.stringify(serviceAreas));

    if (profileImage) {
      payload.append("profileImage", profileImage);
    }

    setSaving(true);

    try {
      const response = await updateMyProviderProfile(payload);
      const updated = response.data.data.provider;

      setProvider(updated);
      setProfileImage(null);

      showNotification("Business profile updated successfully.", "success");
    } catch (err) {
      showNotification(
        err.response?.data?.message ||
          "Unable to update your business profile.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] px-4 py-3 text-sm font-medium text-[#0a1128] placeholder:text-[#64748b] transition-all outline-none focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20 disabled:cursor-not-allowed disabled:opacity-60";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefcfb] px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-4xl space-y-6 animate-pulse"
        >
          <div className="h-32 rounded-3xl border border-[#d8e2eb] bg-white" />
          <div className="h-96 rounded-3xl border border-[#d8e2eb] bg-white" />
          <span className="sr-only">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (fetchError || !provider) {
    return (
      <div className="min-h-screen bg-[#fefcfb] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <FetchErrorBanner
            message={fetchError || "Provider profile not found."}
            onRetry={fetchProfile}
          />
        </div>
      </div>
    );
  }

  const formattedVerificationStatus =
    formatLabel(provider.verificationStatus) || "Pending";

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header Card */}
        <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
            <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
            <span>Provider Portal</span>
          </div>

          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
            Business Profile
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            Manage your business details, branding, and service areas.
          </p>
        </div>

        {/* Profile Summary Card */}
        <section className="mt-7 rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d8e2eb] bg-[#f4f7fa]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Business profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="h-8 w-8 text-[#034078]" />
                )}
              </div>

              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-[#0a1128] sm:text-2xl">
                  {provider.businessName}
                </h2>

                <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#33415c] sm:text-sm">
                  <Briefcase className="h-3.5 w-3.5 text-[#1282a2]" />
                  <span>
                    {provider.experienceYears ?? 0} years of experience
                  </span>
                </p>
              </div>
            </div>

            <BookingStatusBadge status={formattedVerificationStatus} />
          </div>

          {provider.verificationStatus === "rejected" &&
            provider.rejectionReason && (
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800 sm:text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>Rejection reason: {provider.rejectionReason}</span>
              </div>
            )}
        </section>

        {/* Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-8 rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8"
        >
          {/* Business Information */}
          <section>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                <FileText className="h-4 w-4 text-[#1282a2]" />
              </div>
              <h2 className="text-lg font-extrabold text-[#0a1128]">
                Business Information
              </h2>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="businessName"
                  className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                >
                  Business Name *
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={100}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="experienceYears"
                  className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                >
                  Experience (Years) *
                </label>
                <input
                  id="experienceYears"
                  type="number"
                  min={0}
                  max={60}
                  step={1}
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                  >
                    Description
                  </label>
                  <span className="text-xs font-semibold text-[#64748b]">
                    {formData.description.length}/1000
                  </span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  maxLength={1000}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell customers about your expertise and services..."
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Service Areas */}
          <section className="border-t border-[#e2e8f0] pt-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                  <MapPin className="h-4 w-4 text-[#1282a2]" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#0a1128]">
                    Service Areas
                  </h2>
                  <p className="text-xs font-medium text-[#33415c]">
                    Add the cities and states where you offer services.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addArea}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-bold text-[#034078] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#001f54]"
              >
                <Plus className="h-3.5 w-3.5 text-[#1282a2]" />
                <span>Add Area</span>
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {formData.serviceAreas.map((area, index) => (
                <div
                  key={area.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4 sm:flex-row sm:items-end"
                >
                  <div className="flex-1">
                    <label
                      htmlFor={`city-${area.id}`}
                      className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                    >
                      City {index + 1} *
                    </label>
                    <input
                      id={`city-${area.id}`}
                      value={area.city}
                      onChange={(e) =>
                        updateArea(area.id, "city", e.target.value)
                      }
                      placeholder="e.g., Dehradun"
                      required
                      minLength={2}
                      maxLength={100}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor={`state-${area.id}`}
                      className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                    >
                      State {index + 1} *
                    </label>
                    <input
                      id={`state-${area.id}`}
                      value={area.state}
                      onChange={(e) =>
                        updateArea(area.id, "state", e.target.value)
                      }
                      placeholder="e.g., Uttarakhand"
                      required
                      minLength={2}
                      maxLength={100}
                      className={inputClass}
                    />
                  </div>

                  {formData.serviceAreas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArea(area.id)}
                      aria-label={`Remove area ${index + 1}`}
                      title="Remove area"
                      className="inline-flex h-11.5 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 text-xs font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 sm:w-11.5 sm:shrink-0 sm:px-0"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sm:hidden">Remove Area</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Profile Image Upload */}
          <section className="border-t border-[#e2e8f0] pt-7">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                <ImagePlus className="h-4 w-4 text-[#1282a2]" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#0a1128]">
                  Profile Image
                </h2>
                <p className="text-xs font-medium text-[#33415c]">
                  Upload a new logo or photo to replace your current image.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-3 text-xs font-medium text-[#33415c] transition-colors hover:border-[#1282a2] file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#034078] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white file:transition-colors hover:file:bg-[#001f54] sm:text-sm"
              />

              {profileImage && (
                <p className="mt-2.5 text-xs font-bold text-[#034078]">
                  Selected: {profileImage.name}
                </p>
              )}
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end border-t border-[#e2e8f0] pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-8 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderProfile;
