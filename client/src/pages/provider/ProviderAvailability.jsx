import { useCallback, useEffect, useState } from "react";
import { Calendar, Clock, Trash2, Save, Loader2, Sparkles } from "lucide-react";
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
    "rounded-xl border border-[#bfcaff]/55 bg-white/85 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs outline-none transition-all focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30 sm:text-sm";

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
              <span>Provider Portal</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Manage Availability
            </h1>

            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Set one daily working window (IST) for each day you accept
              bookings.
            </p>
          </div>
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
            <div className="h-96 rounded-4xl border border-white/70 bg-white/65" />
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
            <div className="overflow-hidden rounded-4xl border border-white/75 bg-white/80 shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#bfcaff]/30 bg-linear-to-r from-[#f6ebff]/50 via-[#f4f1ff]/50 to-[#ebf6ff]/50 px-5 py-4 sm:px-7">
                <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                  Weekly Schedule
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  1 Shift per Day • IST
                </span>
              </div>

              {/* Compact Day Rows */}
              <div className="divide-y divide-[#bfcaff]/25">
                {DAYS.map((day, dayIndex) => {
                  const slot = getDaySlot(dayIndex);
                  const enabled = Boolean(slot);

                  return (
                    <section
                      key={day}
                      className={`px-5 py-4 transition-colors sm:px-7 ${
                        enabled ? "bg-white/45" : "bg-slate-50/35"
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
                            <span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-200/90 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-xs after:transition-transform peer-checked:bg-linear-to-r peer-checked:from-[#e4a5ff] peer-checked:via-[#cbbdff] peer-checked:to-[#acdcff] peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-[#cbbdff]/40" />
                            <span
                              className={`text-sm font-extrabold ${
                                enabled ? "text-slate-900" : "text-slate-400"
                              }`}
                            >
                              {day}
                            </span>
                          </label>

                          {!enabled && (
                            <span className="text-xs font-semibold text-slate-400 sm:hidden">
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

                            <span className="text-xs font-bold text-slate-400">
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
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-red-200/80 bg-red-50/70 text-red-600 transition-all hover:border-red-300 hover:bg-red-100 hover:text-red-700 active:scale-95"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <p className="hidden text-xs font-semibold text-slate-400 sm:block">
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
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Changes take effect immediately after saving your schedule.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-7 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
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
