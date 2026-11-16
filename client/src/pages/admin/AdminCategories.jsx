import { useCallback, useEffect, useState } from "react";
import {
  FolderKanban,
  Plus,
  RefreshCw,
  Pencil,
  Power,
  ImagePlus,
  Loader2,
  CheckCircle2,
  Layers,
} from "lucide-react";
import {
  getAllCategoriesAdmin,
  createAdminCategory,
  updateAdminCategory,
  updateAdminCategoryStatus,
} from "../../services/admin.api";
import { useNotification } from "../../context/NotificationContext";
import { formatNumber } from "../../utils/formatters";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";
import StatusBadge from "../../components/common/BookingStatusBadge";
import ModalDialog from "../../components/common/ModalDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";

const emptyForm = {
  name: "",
  description: "",
};

const AdminCategories = () => {
  const { showNotification } = useNotification();

  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [confirmCategory, setConfirmCategory] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllCategoriesAdmin();
      setCategories(response.data.data.categories);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!image) {
      setPreview(editingCategory?.image || "");
      return;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image, editingCategory]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({ ...emptyForm });
    setImage(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      description: category.description || "",
    });
    setImage(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingCategory(null);
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file.", "error");
      e.target.value = "";
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const name = form.name.trim();
    const description = form.description.trim();

    if (name.length < 2 || name.length > 100) {
      showNotification("Category name must be 2–100 characters.", "error");
      return;
    }

    if (description.length > 500) {
      showNotification("Description cannot exceed 500 characters.", "error");
      return;
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("description", description);

    if (image) payload.append("image", image);

    setSaving(true);

    try {
      const response = editingCategory
        ? await updateAdminCategory(editingCategory._id, payload)
        : await createAdminCategory(payload);

      setModalOpen(false);
      setEditingCategory(null);
      setImage(null);

      showNotification(
        response.data.message ||
          (editingCategory
            ? "Category updated successfully."
            : "Category created successfully."),
        "success",
      );

      await fetchCategories();
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Unable to save category.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (category) => {
    if (updatingId) return;

    const nextStatus = !category.isActive;
    setUpdatingId(category._id);

    try {
      const response = await updateAdminCategoryStatus(
        category._id,
        nextStatus,
      );

      setCategories((prev) =>
        prev.map((item) =>
          item._id === category._id ? { ...item, isActive: nextStatus } : item,
        ),
      );

      showNotification(
        response.data.message ||
          `Category ${nextStatus ? "activated" : "deactivated"} successfully.`,
        "success",
      );
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Unable to update category status.",
        "error",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleCategories = categories.filter((category) => {
    if (filter === "active") return category.isActive;
    if (filter === "inactive") return !category.isActive;
    return true;
  });

  const activeCount = categories.filter((category) => category.isActive).length;

  const inputClass =
    "mt-2 w-full rounded-2xl border border-[#bfcaff]/50 bg-white/75 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30";

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          title="Manage Categories"
          subtitle="Create, edit, activate, and deactivate service categories."
          action={
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99] sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          }
        />

        <FetchErrorBanner message={error} onRetry={fetchCategories} />

        {/* Summary Metric Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Categories",
              value: categories.length,
              Icon: Layers,
              iconClass:
                "bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-[#deabff]/60",
            },
            {
              label: "Active Categories",
              value: activeCount,
              Icon: CheckCircle2,
              iconClass:
                "bg-emerald-100/80 text-emerald-600 ring-emerald-200/80",
            },
            {
              label: "Inactive Categories",
              value: categories.length - activeCount,
              Icon: Power,
              iconClass: "bg-slate-100/90 text-slate-600 ring-slate-200/80",
            },
          ].map(({ label, value, Icon, iconClass }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-3xl border border-white/75 bg-white/80 p-6 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {label}
                </p>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${iconClass}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                {loading ? "—" : formatNumber(value)}
              </p>
            </div>
          ))}
        </div>

        {/* Filter & Refresh Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/75 bg-white/75 p-3 shadow-[0_4px_25px_rgba(203,189,255,0.12)] backdrop-blur-xl sm:px-4">
          <div className="flex flex-wrap gap-2">
            {["all", "active", "inactive"].map((item) => {
              const isActive = filter === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all active:scale-95 sm:px-5 sm:text-sm ${
                    isActive
                      ? "bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] text-slate-900 shadow-sm shadow-[#cbbdff]/30"
                      : "border border-[#bfcaff]/40 bg-white/70 text-slate-600 hover:border-[#deabff] hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={fetchCategories}
            disabled={loading || Boolean(updatingId)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#bfcaff]/50 bg-white/80 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-[#7c56a8] ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* Categories Content */}
        {loading ? (
          <div
            role="status"
            className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 animate-pulse"
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-88 rounded-3xl border border-white/70 bg-white/65"
              />
            ))}
            <span className="sr-only">Loading categories...</span>
          </div>
        ) : visibleCategories.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<FolderKanban className="h-7 w-7 text-[#7c56a8]" />}
              title="No categories found"
              message="There are no categories matching the selected filter."
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleCategories.map((category) => (
              <article
                key={category._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/75 bg-white/80 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#deabff]/70 hover:shadow-[0_14px_40px_rgba(203,189,255,0.25)]"
              >
                {/* Category Image Header */}
                <div className="relative h-44 overflow-hidden bg-linear-to-br from-[#f6ebff] via-[#f4f1ff] to-[#ebf6ff]">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-[#8b7cc8] shadow-xs backdrop-blur-xl">
                        <FolderKanban className="h-6 w-6" />
                      </div>
                    </div>
                  )}

                  <StatusBadge
                    status={category.isActive ? "Active" : "Inactive"}
                    className="absolute right-3.5 top-3.5 px-3 py-1 backdrop-blur-xl"
                  />
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                    {category.name}
                  </h2>

                  <p className="mt-1 font-mono text-xs font-medium text-slate-400">
                    /{category.slug}
                  </p>

                  <p className="mt-4 line-clamp-3 min-h-18 text-sm font-medium leading-6 text-slate-600">
                    {category.description || "No description provided."}
                  </p>

                  <div className="mt-auto pt-6">
                    <div className="flex gap-3 border-t border-[#bfcaff]/30 pt-5">
                      <button
                        type="button"
                        onClick={() => openEditModal(category)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#bfcaff]/50 bg-white/75 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-[0.98] sm:text-sm"
                      >
                        <Pencil className="h-3.5 w-3.5 text-[#7c56a8]" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmCategory(category)}
                        disabled={Boolean(updatingId)}
                        className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:text-sm ${
                          category.isActive
                            ? "border border-red-200/90 bg-red-50/75 text-red-600 hover:border-red-300 hover:bg-red-100/80 hover:text-red-700"
                            : "border border-emerald-200/90 bg-emerald-50/85 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100/90"
                        }`}
                      >
                        <Power className="h-3.5 w-3.5" />
                        <span>
                          {updatingId === category._id
                            ? "Updating..."
                            : category.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <ModalDialog
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        disabled={saving}
        maxWidth="max-w-lg max-h-[90vh] overflow-y-auto"
        titleId="category-dialog-title"
        title={editingCategory ? "Edit Category" : "Create Category"}
        icon={FolderKanban}
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="rounded-xl border border-[#bfcaff]/50 bg-white/75 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:brightness-105 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {saving
                  ? "Saving..."
                  : editingCategory
                    ? "Save Changes"
                    : "Create Category"}
              </span>
            </button>
          </>
        }
      >
        <p className="text-xs font-medium text-slate-500">
          {editingCategory
            ? "Update category details and cover image."
            : "Add a new service category to DoorAssist."}
        </p>

        <div className="mt-4 space-y-5">
          <div>
            <label
              htmlFor="categoryName"
              className="text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              Category Name <span className="text-rose-500">*</span>
            </label>

            <input
              id="categoryName"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="e.g. Home Cleaning"
              minLength={2}
              maxLength={100}
              required
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="categoryDescription"
                className="text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Description
              </label>

              <span className="text-xs font-semibold text-slate-400">
                {form.description.length}/500
              </span>
            </div>

            <textarea
              id="categoryDescription"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the services under this category..."
              rows={4}
              maxLength={500}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="categoryImage"
              className="text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              Category Image (Optional)
            </label>

            <div className="mt-3 flex h-40 items-center justify-center overflow-hidden rounded-3xl border border-white/80 bg-linear-to-br from-[#f6ebff] via-[#f4f1ff] to-[#ebf6ff] shadow-inner">
              {preview ? (
                <img
                  src={preview}
                  alt="Category preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-[#8b7cc8] shadow-xs backdrop-blur-xl">
                  <ImagePlus className="h-5 w-5" />
                </div>
              )}
            </div>

            <input
              key={editingCategory?._id || "new"}
              id="categoryImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-4 block w-full text-xs font-medium text-slate-600 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-linear-to-r file:from-[#e4a5ff] file:via-[#cbbdff] file:to-[#acdcff] file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-slate-900 file:shadow-xs file:transition-all hover:file:brightness-105 sm:text-sm"
            />
          </div>
        </div>
      </ModalDialog>

      {/* Category Status Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(confirmCategory)}
        onClose={() => setConfirmCategory(null)}
        onConfirm={async () => {
          if (!confirmCategory || updatingId) return;

          const category = confirmCategory;

          await handleStatusChange(category);
          setConfirmCategory(null);
        }}
        title={
          confirmCategory?.isActive
            ? "Deactivate Category"
            : "Activate Category"
        }
        message={`Are you sure you want to ${
          confirmCategory?.isActive ? "deactivate" : "activate"
        } "${confirmCategory?.name || ""}"?`}
        confirmText={confirmCategory?.isActive ? "Deactivate" : "Activate"}
        variant={confirmCategory?.isActive ? "danger" : "success"}
        loading={Boolean(updatingId)}
      />
    </div>
  );
};

export default AdminCategories;
