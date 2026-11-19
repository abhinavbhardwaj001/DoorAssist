import { useEffect, useState } from "react";
import {
  ChevronDown,
  Clock,
  ImagePlus,
  IndianRupee,
  Info,
  Layers,
  Loader2,
  Save,
  Sparkles,
  Tag,
  Wrench,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { generateServiceCopy } from "../../services/ai.api";

const initialValues = {
  categoryId: "",
  name: "",
  description: "",
  pricingType: "fixed",
  price: "",
  durationMinutes: "60",
};

const ProviderServiceForm = ({
  categories,
  initialData,
  onSubmit,
  submitting,
  submitLabel,
}) => {
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState(initialValues);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      categoryId:
        typeof initialData.categoryId === "object"
          ? initialData.categoryId?._id || ""
          : initialData.categoryId || "",
      name: initialData.name || "",
      description: initialData.description || "",
      pricingType: initialData.pricingType || "fixed",
      price: initialData.price ?? "",
      durationMinutes: initialData.durationMinutes ?? "60",
    });
  }, [initialData]);

  useEffect(() => {
    if (!image) {
      setPreview(initialData?.image || "");
      return;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "pricingType" && value === "on_request"
        ? { price: "" }
        : {}),
    }));
  };

  const handleGenerateDescription = async () => {
    const trimmedName = formData.name.trim();

    if (trimmedName.length < 2) {
      showNotification(
        "Enter a service name first so AI can write your description.",
        "error",
      );
      return;
    }

    const selectedCategory = categories.find(
      (c) => String(c._id) === String(formData.categoryId),
    );

    setGeneratingAi(true);

    try {
      const response = await generateServiceCopy({
        name: trimmedName,
        categoryName: selectedCategory?.name || "",
        notes: formData.description.trim().slice(0, 500),
      });

      setFormData((prev) => ({
        ...prev,
        description: response.data.data.description,
      }));

      showNotification(
        "Description generated! Review or edit before saving.",
        "success",
      );
    } catch (err) {
      showNotification(
        err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          "Unable to generate description right now.",
        "error",
      );
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image.", "error");
      e.target.value = "";
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const description = formData.description.trim();
    const duration = Number(formData.durationMinutes);

    if (name.length < 2 || name.length > 150) {
      showNotification("Service name must contain 2–150 characters.", "error");
      return;
    }

    if (description.length > 1000) {
      showNotification("Description cannot exceed 1000 characters.", "error");
      return;
    }

    if (!formData.categoryId) {
      showNotification("Please select a category.", "error");
      return;
    }

    if (
      formData.durationMinutes === "" ||
      !Number.isInteger(duration) ||
      duration < 15
    ) {
      showNotification(
        "Duration must be a whole number of at least 15 minutes.",
        "error",
      );
      return;
    }

    if (formData.pricingType !== "on_request") {
      if (
        formData.price === "" ||
        !Number.isFinite(Number(formData.price)) ||
        Number(formData.price) < 0
      ) {
        showNotification("Enter a valid price of ₹0 or more.", "error");
        return;
      }
    }

    const payload = new FormData();

    payload.append("categoryId", formData.categoryId);
    payload.append("name", name);
    payload.append("description", description);
    payload.append("pricingType", formData.pricingType);
    payload.append("durationMinutes", String(duration));

    if (formData.pricingType !== "on_request") {
      payload.append("price", formData.price);
    }

    if (image) {
      payload.append("image", image);
    }

    try {
      await onSubmit(payload);
    } catch (err) {}
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-sm font-medium text-[#0a1128] placeholder:text-[#64748b] shadow-2xs transition-colors outline-none focus:border-[#1282a2] focus:ring-3 focus:ring-[#1282a2]/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8"
    >
      <div className="space-y-8">
        {/* Service Information */}
        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
                Service Information
              </h2>
              <p className="text-xs font-medium text-[#33415c]">
                Choose a category and describe what your service includes.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="categoryId"
                className="text-xs font-bold uppercase tracking-wider text-[#64748b]"
              >
                Category <span className="text-red-600">*</span>
              </label>

              <div className="relative">
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}

                  {initialData?.categoryId &&
                    !categories.some(
                      (category) => category._id === formData.categoryId,
                    ) &&
                    formData.categoryId && (
                      <option value={formData.categoryId}>
                        Current category (unavailable in active categories)
                      </option>
                    )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-[#1282a2]" />
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-wider text-[#64748b]"
              >
                Service Name <span className="text-red-600">*</span>
              </label>

              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Deep Home Cleaning"
                minLength={2}
                maxLength={150}
                required
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="description"
                  className="text-xs font-bold uppercase tracking-wider text-[#64748b]"
                >
                  Description
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={generatingAi || submitting}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#1282a2]/35 bg-[#f4f7fa] px-3.5 py-1 text-xs font-extrabold text-[#034078] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#034078] hover:text-white disabled:pointer-events-none disabled:opacity-55"
                  >
                    {generatingAi ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Writing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Write with AI</span>
                      </>
                    )}
                  </button>

                  <span className="text-xs font-semibold text-[#64748b]">
                    {formData.description.length}/1000
                  </span>
                </div>
              </div>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what the service includes, or type a few rough keywords and click Write with AI..."
                maxLength={1000}
                rows={5}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Pricing and Duration */}
        <section className="border-t border-[#e2e8f0] pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
                Pricing and Duration
              </h2>
              <p className="text-xs font-medium text-[#33415c]">
                Set your rate structure and estimated service time.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pricingType"
                className="text-xs font-bold uppercase tracking-wider text-[#64748b]"
              >
                Pricing Type <span className="text-red-600">*</span>
              </label>

              <div className="relative">
                <select
                  id="pricingType"
                  name="pricingType"
                  value={formData.pricingType}
                  onChange={handleChange}
                  required
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="starting_from">Starting From</option>
                  <option value="on_request">On Request</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-[#1282a2]" />
              </div>
            </div>

            {formData.pricingType !== "on_request" && (
              <div>
                <label
                  htmlFor="price"
                  className="text-xs font-bold uppercase tracking-wider text-[#64748b]"
                >
                  Price (₹) <span className="text-red-600">*</span>
                </label>

                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-3.5 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-[#1282a2]" />

                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    min={0}
                    step="any"
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="durationMinutes"
                className="text-xs font-bold uppercase tracking-wider text-[#64748b]"
              >
                Duration (Minutes) <span className="text-red-600">*</span>
              </label>

              <div className="relative">
                <Clock className="pointer-events-none absolute left-3.5 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-[#1282a2]" />

                <input
                  id="durationMinutes"
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  min={15}
                  step={1}
                  required
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          {formData.pricingType === "on_request" && (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-[#1282a2]/30 border-l-4 border-l-[#1282a2] bg-[#f4f7fa] p-4 text-xs font-semibold text-[#0a1128] sm:text-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1282a2]" />
              <span>
                Customers will see &ldquo;Price on request&rdquo; instead of a
                fixed amount. Your current booking API does not allow direct
                booking of these services.
              </span>
            </div>
          )}
        </section>

        {/* Image */}
        <section className="border-t border-[#e2e8f0] pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
                Service Image
              </h2>
              <p className="text-xs font-medium text-[#33415c]">
                Upload an optional image that represents your service.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="flex h-44 items-center justify-center overflow-hidden rounded-3xl border border-[#d8e2eb] bg-[#f8fafc] shadow-2xs">
              {preview ? (
                <img
                  src={preview}
                  alt="Service preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-white text-[#034078] shadow-2xs">
                  <Wrench className="h-6 w-6" />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4 sm:p-5">
              <label
                htmlFor="serviceImage"
                className="text-xs font-bold uppercase tracking-wider text-[#64748b]"
              >
                Choose Image
              </label>

              <input
                id="serviceImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-3 block w-full text-xs font-medium text-[#33415c] file:mr-4 file:cursor-pointer file:rounded-xl file:border file:border-[#cbd5e1] file:bg-white file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-[#0a1128] file:shadow-2xs file:transition-colors hover:file:border-[#034078] hover:file:bg-[#f4f7fa] hover:file:text-[#034078] sm:text-sm"
              />

              {image && (
                <p className="mt-3 truncate text-xs font-semibold text-[#64748b]">
                  Selected:{" "}
                  <span className="font-bold text-[#0a1128]">{image.name}</span>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-wrap items-center justify-end gap-4 border-t border-[#e2e8f0] pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-8 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-55 sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{submitLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProviderServiceForm;
