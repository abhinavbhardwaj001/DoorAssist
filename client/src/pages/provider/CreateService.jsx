import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Layers } from "lucide-react";
import ProviderServiceForm from "../../components/services/ProviderServiceForm";
import { getActiveCategories } from "../../services/category.api";
import { createProviderService } from "../../services/service.api";
import { useNotification } from "../../context/NotificationContext";
import EmptyState from "../../components/common/EmptyState";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const CreateService = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getActiveCategories();
      setCategories(response.data.data.categories || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load service categories.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (payload) => {
    setSubmitting(true);

    try {
      await createProviderService(payload);
      showNotification("Service created successfully!", "success");

      navigate("/provider/services", { replace: true });
    } catch (err) {
      showNotification(
        err.response?.data?.message ||
          "Unable to create service. Please try again.",
        "error",
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/provider/services"
          className="inline-flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2.5 text-xs font-bold text-[#0a1128] shadow-xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[#1282a2]" />
          <span>Back to My Services</span>
        </Link>

        {/* Page Header Card */}
        <div className="mt-6 rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
            <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
            <span>Provider Portal</span>
          </div>

          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
            Create Service
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            Add a new service offering to your DoorAssist business profile.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div
            role="status"
            className="mt-8 h-96 animate-pulse rounded-3xl border border-[#d8e2eb] bg-white"
          >
            <span className="sr-only">Loading categories...</span>
          </div>
        ) : error ? (
          <FetchErrorBanner
            message={error}
            onRetry={fetchCategories}
            className="mt-8"
          />
        ) : categories.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<Layers className="h-7 w-7 text-[#034078]" />}
              title="No active categories available"
              message="Service categories must be active before you can list a new service."
              actionLabel="Back to My Services"
              actionLink="/provider/services"
            />
          </div>
        ) : (
          <div className="mt-8">
            <ProviderServiceForm
              categories={categories}
              submitting={submitting}
              submitLabel="Create Service"
              onSubmit={handleCreate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateService;
