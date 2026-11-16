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
  Sparkles,
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
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
              <span>Provider Portal</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              My Services
            </h1>

            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Create, edit, and manage your service listings on DoorAssist.
            </p>
          </div>

          <Link
            to="/provider/services/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </Link>
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
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-5 py-2.5 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
          >
            <RefreshCw
              className={`h-4 w-4 text-[#7c56a8] ${loading ? "animate-spin" : ""}`}
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
                className="h-96 rounded-4xl border border-white/70 bg-white/65"
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
              icon={<Wrench className="h-7 w-7 text-[#7c56a8]" />}
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
                  className="group flex flex-col overflow-hidden rounded-4xl border border-white/75 bg-white/80 shadow-[0_8px_30px_rgba(203,189,255,0.16)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#deabff]/70 hover:bg-white/95 hover:shadow-[0_14px_35px_rgba(203,189,255,0.24)]"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-linear-to-br from-[#f6ebff] via-[#f4f1ff] to-[#ebf6ff]">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/80 bg-white/75 text-[#8b7cc8] shadow-sm backdrop-blur-xl">
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
                    <span className="inline-block w-fit rounded-full border border-[#deabff]/65 bg-linear-to-r from-[#f6ebff]/90 via-[#f4f1ff]/90 to-[#ebf6ff]/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800 shadow-xs">
                      {service.categoryId?.name || "Uncategorized"}
                    </span>

                    <h2 className="mt-3 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                      {service.name}
                    </h2>

                    <p className="mt-2 line-clamp-2 min-h-10 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
                      {service.description || "No description provided."}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#bfcaff]/25 pt-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Price
                        </p>
                        <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                          {formatServicePrice(service)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Duration
                        </p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-bold text-slate-800">
                          <Clock className="h-3.5 w-3.5 text-[#7c56a8]" />
                          <span>{service.durationMinutes} min</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2.5 pt-1">
                      <Link
                        to={`/provider/services/${service._id}/edit`}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#bfcaff]/55 bg-white/85 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-95 sm:text-sm"
                      >
                        <Pencil className="h-3.5 w-3.5 text-[#7c56a8]" />
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        disabled={Boolean(updatingId)}
                        onClick={() => handleStatusChange(service)}
                        className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 sm:text-sm ${
                          service.isActive
                            ? "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700"
                            : "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
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
