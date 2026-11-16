import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import ProviderServiceForm from "../../components/services/ProviderServiceForm";
import { getActiveCategories } from "../../services/category.api";
import {
  getMyProviderServices,
  updateProviderService,
} from "../../services/service.api";
import { useNotification } from "../../context/NotificationContext";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const EditService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [service, setService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [servicesResponse, categoriesResponse] = await Promise.all([
        getMyProviderServices(),
        getActiveCategories(),
      ]);

      const myServices = servicesResponse.data.data.services || [];

      const selectedService = myServices.find((item) => item._id === serviceId);

      if (!selectedService) {
        setError("Service not found in your listings.");
        return;
      }

      setService(selectedService);
      setCategories(categoriesResponse.data.data.categories || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load service details.",
      );
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = async (payload) => {
    setSubmitting(true);

    try {
      await updateProviderService(serviceId, payload);
      showNotification("Service updated successfully!", "success");

      navigate("/provider/services", { replace: true });
    } catch (err) {
      showNotification(
        err.response?.data?.message ||
          "Unable to update service. Please try again.",
        "error",
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/provider/services"
          className="inline-flex items-center gap-2 rounded-full border border-[#bfcaff]/45 bg-white/70 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[#7c56a8]" />
          <span>Back to My Services</span>
        </Link>

        {/* Page Header */}
        <div className="mt-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
            <span>Provider Portal</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Edit Service
          </h1>

          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Update your service information, pricing, and image.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div
            role="status"
            className="mt-8 h-96 animate-pulse rounded-4xl border border-white/70 bg-white/65"
          >
            <span className="sr-only">Loading service...</span>
          </div>
        ) : error ? (
          <FetchErrorBanner
            message={error}
            onRetry={fetchData}
            className="mt-8"
          />
        ) : service ? (
          <div className="mt-8">
            <ProviderServiceForm
              initialData={service}
              categories={categories}
              submitting={submitting}
              submitLabel="Save Changes"
              onSubmit={handleUpdate}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EditService;
