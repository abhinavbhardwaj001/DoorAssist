import { useCallback, useEffect, useState } from "react";
import { Calendar, Clock, Trash2, Save, Loader2 } from "lucide-react";
import {
  getMyProviderProfile,
  updateProviderAvailability,
} from "../../services/provider.api";
import { useNotification } from "../../context/NotificationContext";
import StatCard from "../../components/common/StatCard";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ProviderAvailability = () => {
  const { showNotification } = useNotification();

  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setFetchError("");

    try {
      const response = await getMyProviderProfile();
      const provider = response.data.data.provider;

      setAvailability(
        Array.isArray(provider?.availability)
          ? provider.availability.map((slot) => ({
              dayOfWeek: slot.dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
            }))
          : [],
      );
    } catch (err) {
      setFetchError(
        err.response?.data?.message || "Unable to load your availability.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const getDaySlot = (dayIndex) =>
    availability.find((slot) => slot.dayOfWeek === dayIndex) || null;

  const enableDaySlot = (dayIndex) => {
    setAvailability((prev) => {
      if (prev.some((slot) => slot.dayOfWeek === dayIndex)) {
        return prev;
      }
      return [
        ...prev,
        {
          dayOfWeek: dayIndex,
          startTime: "09:00",
          endTime: "17:00",
        },
      ];
    });
  };

  const removeDaySlot = (dayIndex) => {
    setAvailability((prev) =>
      prev.filter((slot) => slot.dayOfWeek !== dayIndex),
    );
  };

  const updateDaySlot = (dayIndex, field, value) => {
    setAvailability((prev) =>
      prev.map((slot) =>
        slot.dayOfWeek === dayIndex ? { ...slot, [field]: value } : slot,
      ),
    );
  };

  const toggleDay = (dayIndex) => {
    const hasSlot = availability.some((slot) => slot.dayOfWeek === dayIndex);

    if (hasSlot) {
      removeDaySlot(dayIndex);
    } else {
      enableDaySlot(dayIndex);
    }
  };

  const validateAvailability = (slots) => {
    const seenDays = new Set();

    for (const slot of slots) {
      if (seenDays.has(slot.dayOfWeek)) {
        return `${DAYS[slot.dayOfWeek]} can only have one time window per day.`;
      }
      seenDays.add(slot.dayOfWeek);

      if (!slot.startTime || !slot.endTime) {
        return "Please enter both start and end times.";
      }

      if (slot.startTime >= slot.endTime) {
        return `${DAYS[slot.dayOfWeek]}: End time must be later than start time.`;
      }
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    const validationError = validateAvailability(availability);

    if (validationError) {
      showNotification(validationError, "error");
      return;
    }

    const sortedAvailability = [...availability].sort(
      (a, b) => a.dayOfWeek - b.dayOfWeek,
    );

    setSaving(true);

    try {
      await updateProviderAvailability(sortedAvailability);
      setAvailability(sortedAvailability);
      showNotification(
        "Your availability has been updated successfully.",
        "success",
      );
    } catch (err) {
      showNotification(
        err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          "Unable to update your availability.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const activeDays = availability.length;
  const offDays = 7 - activeDays;

  const timeInputClass =
    "rounded-xl border border-[#cbd5e1] bg-[#fefcfb] px-3 py-1.5 text-xs font-bold text-[#0a1128] outline-none transition-all focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20 sm:text-sm";

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Card */}
        <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
            <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
            <span>Provider Portal</span>
          </div>

          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
            Manage Availability
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            Set one daily working window (IST) for each day you accept bookings.
          </p>
        </div>

        {/* Overview KPIs */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Working Days"
            value={`${activeDays} / 7`}
            icon={Calendar}
            variant="brand"
            loading={loading}
            format={false}
          />
          <StatCard
            label="Days Off"
            value={`${offDays} / 7`}
            icon={Clock}
            variant="violet"
            loading={loading}
            format={false}
          />
        </div>

        {loading ? (
          <div role="status" className="mt-7 space-y-3 animate-pulse">
            <div className="h-96 rounded-3xl border border-[#d8e2eb] bg-white" />
            <span className="sr-only">Loading availability...</span>
          </div>
        ) : fetchError ? (
          <FetchErrorBanner
            message={fetchError}
            onRetry={fetchAvailability}
            className="mt-7"
          />
        ) : (
          <form onSubmit={handleSubmit} className="mt-7">
            <div className="overflow-hidden rounded-3xl border border-[#d8e2eb] bg-white shadow-xs">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0] bg-[#f4f7fa] px-5 py-4 sm:px-7">
                <h2 className="text-base font-extrabold text-[#0a1128] sm:text-lg">
                  Weekly Schedule
                </h2>
                <span className="rounded-lg border border-[#d8e2eb] bg-white px-2.5 py-1 text-xs font-bold text-[#034078]">
                  1 Shift per Day • IST
                </span>
              </div>

              {/* Compact Day Rows */}
              <div className="divide-y divide-[#e2e8f0]">
                {DAYS.map((day, dayIndex) => {
                  const slot = getDaySlot(dayIndex);
                  const enabled = Boolean(slot);

                  return (
                    <section
                      key={day}
                      className={`px-5 py-4 transition-colors sm:px-7 ${
                        enabled ? "bg-white" : "bg-[#f8fafc]"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center justify-between sm:w-44 sm:shrink-0 sm:justify-start sm:gap-3">
                          <label className="inline-flex cursor-pointer items-center gap-3 select-none">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => toggleDay(dayIndex)}
                              className="peer sr-only"
                            />
                            <span className="relative h-6 w-11 shrink-0 rounded-full bg-[#cbd5e1] transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-xs after:transition-transform peer-checked:bg-[#1282a2] peer-checked:after:translate-x-5 peer-focus-visible:ring-3 peer-focus-visible:ring-[#1282a2]/30" />
                            <span
                              className={`text-sm font-extrabold ${
                                enabled ? "text-[#0a1128]" : "text-[#64748b]"
                              }`}
                            >
                              {day}
                            </span>
                          </label>

                          {!enabled && (
                            <span className="text-xs font-semibold text-[#64748b] sm:hidden">
                              Unavailable
                            </span>
                          )}
                        </div>

                        {enabled ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              id={`start-${dayIndex}`}
                              aria-label={`${day} start time`}
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateDaySlot(
                                  dayIndex,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                              required
                              className={timeInputClass}
                            />

                            <span className="text-xs font-bold text-[#64748b]">
                              to
                            </span>

                            <input
                              id={`end-${dayIndex}`}
                              aria-label={`${day} end time`}
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateDaySlot(
                                  dayIndex,
                                  "endTime",
                                  e.target.value,
                                )
                              }
                              required
                              className={timeInputClass}
                            />

                            <button
                              type="button"
                              onClick={() => removeDaySlot(dayIndex)}
                              aria-label={`Disable ${day}`}
                              title="Mark day unavailable"
                              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <p className="hidden text-xs font-semibold text-[#64748b] sm:block">
                            Unavailable
                          </p>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>

            {/* Footer Save Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-medium text-[#33415c] sm:text-sm">
                Changes take effect immediately after saving your schedule.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-7 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? "Saving..." : "Save Availability"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProviderAvailability;
