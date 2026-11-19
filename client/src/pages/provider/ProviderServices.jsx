import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Wrench,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Clock,
  Pencil,
  Power,
  Loader2,
} from "lucide-react";
import {
  getMyProviderServices,
  updateServiceStatus,
} from "../../services/service.api";
import { useNotification } from "../../context/NotificationContext";
import { formatServicePrice } from "../../utils/formatters";
import StatCard from "../../components/common/StatCard";
import FilterTabs from "../../components/common/FilterTabs";
import BookingStatusBadge from "../../components/common/BookingStatusBadge";
import EmptyState from "../../components/common/EmptyState";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const ProviderServices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!location.state?.success) return;

    showNotification(location.state.success, "success");

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.state, navigate, showNotification]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setFetchError("");

    try {
      const response = await getMyProviderServices();
      setServices(response.data.data.services || []);
    } catch (err) {
      setFetchError(
        err.response?.data?.message || "Unable to load your services.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleStatusChange = async (service) => {
    if (updatingId) return;

    const newStatus = !service.isActive;
    setUpdatingId(service._id);

    try {
      const response = await updateServiceStatus(service._id, newStatus);
      const updatedService = response.data.data.service;

      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id
            ? {
                ...item,
                ...updatedService,
                categoryId:
                  updatedService.categoryId &&
                  typeof updatedService.categoryId === "object"
                    ? updatedService.categoryId
                    : item.categoryId,
              }
            : item,
        ),
      );

      showNotification(
        response.data.message ||
          `Service ${newStatus ? "activated" : "deactivated"} successfully.`,
        "success",
      );
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Unable to update service status.",
        "error",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredServices = services.filter((service) => {
    if (filter === "active") return service.isActive;
    if (filter === "inactive") return !service.isActive;
    return true;
  });

  const activeCount = services.filter((service) => service.isActive).length;
  const inactiveCount = services.length - activeCount;

  const filterOptions = [
    { value: "all", label: `All (${services.length})` },
    { value: "active", label: `Active (${activeCount})` },
    { value: "inactive", label: `Inactive (${inactiveCount})` },
  ];

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Card */}
        <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
                <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
                <span>Provider Portal</span>
              </div>

              <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
                My Services
              </h1>

              <p className="mt-1.5 text-sm font-medium text-[#33415c]">
                Create, edit, and manage your service listings on DoorAssist.
              </p>
            </div>

            <Link
              to="/provider/services/create"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Service</span>
            </Link>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Services"
            value={services.length}
            icon={Wrench}
            variant="brand"
            loading={loading}
          />
          <StatCard
            label="Active Services"
            value={activeCount}
            icon={CheckCircle2}
            variant="emerald"
            loading={loading}
          />
          <StatCard
            label="Inactive Services"
            value={inactiveCount}
            icon={XCircle}
            variant="rose"
            loading={loading}
          />
        </div>

        {/* Filters & Refresh */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <FilterTabs
            options={filterOptions}
            value={filter}
            onChange={setFilter}
          />

          <button
            type="button"
            onClick={fetchServices}
            disabled={loading || Boolean(updatingId)}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-2.5 text-xs font-bold text-[#0a1128] shadow-xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
          >
            <RefreshCw
              className={`h-4 w-4 text-[#1282a2] ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* Service Cards */}
        {loading ? (
          <div
            role="status"
            className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3 animate-pulse"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 rounded-3xl border border-[#d8e2eb] bg-white"
              />
            ))}
            <span className="sr-only">Loading services...</span>
          </div>
        ) : fetchError ? (
          <FetchErrorBanner
            message={fetchError}
            onRetry={fetchServices}
            className="mt-6"
          />
        ) : filteredServices.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<Wrench className="h-7 w-7 text-[#034078]" />}
              title="No services found"
              message={
                filter === "all"
                  ? "Start by creating your first service listing."
                  : `You currently have no ${filter} services.`
              }
              actionLabel={filter === "all" ? "Create Service" : "Show All"}
              actionLink={
                filter === "all" ? "/provider/services/create" : undefined
              }
              onAction={filter !== "all" ? () => setFilter("all") : undefined}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => {
              const isUpdating = updatingId === service._id;

              return (
                <article
                  key={service._id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-[#d8e2eb] bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1282a2] hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden border-b border-[#e2e8f0] bg-[#f4f7fa]">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-white text-[#034078] shadow-xs">
                          <Wrench className="h-8 w-8" />
                        </div>
                      </div>
                    )}

                    <div className="absolute right-4 top-4">
                      <BookingStatusBadge
                        status={service.isActive ? "Active" : "Inactive"}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="inline-block w-fit rounded-lg border border-[#1282a2]/25 bg-[#1282a2]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#034078]">
                      {service.categoryId?.name || "Uncategorized"}
                    </span>

                    <h2 className="mt-3 text-lg font-extrabold tracking-tight text-[#0a1128] transition-colors group-hover:text-[#034078] sm:text-xl">
                      {service.name}
                    </h2>

                    <p className="mt-2 line-clamp-2 min-h-10 text-xs font-medium leading-5 text-[#33415c] sm:text-sm">
                      {service.description || "No description provided."}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e2e8f0] pt-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                          Price
                        </p>
                        <p className="mt-0.5 text-sm font-extrabold text-[#0a1128]">
                          {formatServicePrice(service)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                          Duration
                        </p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-bold text-[#0a1128]">
                          <Clock className="h-3.5 w-3.5 text-[#1282a2]" />
                          <span>{service.durationMinutes} min</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2.5 pt-1">
                      <Link
                        to={`/provider/services/${service._id}/edit`}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2.5 text-xs font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] sm:text-sm"
                      >
                        <Pencil className="h-3.5 w-3.5 text-[#1282a2]" />
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        disabled={Boolean(updatingId)}
                        onClick={() => handleStatusChange(service)}
                        className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors disabled:pointer-events-none disabled:opacity-50 sm:text-sm ${
                          service.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Power className="h-3.5 w-3.5" />
                        )}
                        <span>
                          {isUpdating
                            ? "Updating..."
                            : service.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderServices;
