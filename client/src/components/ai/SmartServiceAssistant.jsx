import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Send,
  Loader2,
  ArrowUpRight,
  ShieldAlert,
  Wrench,
  Clock,
  X,
  RotateCcw,
  Bot,
} from "lucide-react";
import { diagnoseHomeIssue } from "../../services/ai.api";
import { useNotification } from "../../context/NotificationContext";

const SAMPLE_PROMPTS = [
  "Kitchen sink pipe is leaking under the cabinet",
  "Split AC not cooling and making a rattling noise",
  "Full 2BHK deep cleaning before guests arrive",
];

const URGENCY_STYLES = {
  high: {
    label: "High Urgency",
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-600",
  },
  medium: {
    label: "Moderate Urgency",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-600",
  },
  low: {
    label: "Routine Service",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-600",
  },
};

const formatServicePrice = (service) => {
  if (service.pricingType === "on_request" || service.price == null) {
    return "Price on Request";
  }
  if (service.pricingType === "starting_from") {
    return `From ₹${service.price}`;
  }
  return `₹${service.price}`;
};

const SmartServiceAssistant = () => {
  const { showNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e, customPrompt) => {
    if (e) e.preventDefault();
    const query = (customPrompt ?? problem).trim();

    if (query.length < 5) {
      showNotification("Describe your issue in a few words first.", "error");
      return;
    }

    if (customPrompt) setProblem(customPrompt);
    setLoading(true);

    try {
      const response = await diagnoseHomeIssue(query);
      setResult(response.data.data);
    } catch (err) {
      showNotification(
        err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          "Could not analyze your request.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProblem("");
    setResult(null);
  };

  const urgencyKey = String(
    result?.recommendation?.urgency || "low",
  ).toLowerCase();
  const urgencyMeta = URGENCY_STYLES[urgencyKey] || URGENCY_STYLES.low;

  return (
    <div
      style={{ bottom: "calc(1.75rem + env(safe-area-inset-bottom, 0px))" }}
      className="fixed right-4 z-60 flex flex-col items-end sm:right-7"
    >
      {/* Expanded Co-Pilot Drawer */}
      {isOpen && (
        <div className="mb-3 flex max-h-[calc(100dvh-9rem)] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-[#d8e2eb] bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="shrink-0 border-b border-[#034078] bg-[#0a1128] px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#1282a2]/40 bg-[#034078] text-white">
                  <Bot className="h-5 w-5 text-[#1282a2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold tracking-tight text-white">
                      DoorAssist AI Co-Pilot
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#1282a2]/40 bg-[#001f54] px-2 py-0.5 text-[10px] font-bold text-[#38bdf8]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#38bdf8]" />
                      Live
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#cbd5e1]">
                    Describe a home issue — I&apos;ll match the right expert
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-[#001f54] text-[#cbd5e1] transition-colors hover:border-[#1282a2] hover:bg-[#034078] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#fefcfb] p-5">
            <form onSubmit={handleAnalyze} className="space-y-3">
              <div className="rounded-2xl border border-[#cbd5e1] bg-white p-2.5 shadow-2xs transition-colors focus-within:border-[#1282a2] focus-within:ring-3 focus-within:ring-[#1282a2]/20">
                <textarea
                  rows={2}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAnalyze(e);
                    }
                  }}
                  placeholder="e.g., Bedroom AC is leaking water indoors and not cooling..."
                  className="w-full resize-none bg-transparent px-1.5 text-sm font-medium text-[#0a1128] outline-none placeholder:text-[#64748b]"
                />

                <div className="mt-2 flex items-center justify-between border-t border-[#e2e8f0] pt-2">
                  {result ? (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-[#64748b] transition-colors hover:text-[#034078]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>New query</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#64748b]">
                      Press Enter to diagnose
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#034078] px-4 py-1.5 text-xs font-extrabold text-white shadow-xs transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Diagnosing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Match Service</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Example Prompts */}
            {!result && (
              <div className="mt-4">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748b]">
                  Quick Examples
                </p>
                <div className="mt-2 flex flex-col gap-1.5">
                  {SAMPLE_PROMPTS.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      disabled={loading}
                      onClick={() => handleAnalyze(null, sample)}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-[#d8e2eb] bg-white px-3 py-2 text-left text-xs font-semibold text-[#33415c] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#0a1128] disabled:pointer-events-none disabled:opacity-50"
                    >
                      <span className="line-clamp-1">{sample}</span>
                      <ArrowUpRight className="ml-2 h-3.5 w-3.5 shrink-0 text-[#1282a2]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Diagnosis & Live Matched Services */}
            {result && (
              <div className="mt-4 space-y-3.5 rounded-2xl border border-[#d8e2eb] bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                      <Wrench className="h-4 w-4 text-[#1282a2]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748b]">
                        Best Match Category
                      </p>
                      <p className="text-sm font-extrabold text-[#0a1128]">
                        {result.recommendation.categoryName}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${urgencyMeta.badge}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${urgencyMeta.dot}`}
                    />
                    {urgencyMeta.label}
                  </span>
                </div>

                <p className="text-xs font-medium leading-relaxed text-[#33415c]">
                  {result.recommendation.diagnosis}
                </p>

                {result.recommendation.safetyTip && (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                    <span>{result.recommendation.safetyTip}</span>
                  </div>
                )}

                {result.matchedServices?.length > 0 && (
                  <div className="space-y-2 border-t border-[#e2e8f0] pt-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748b]">
                      Available Services
                    </p>
                    {result.matchedServices.map((svc) => (
                      <Link
                        key={svc._id}
                        to={`/services/${svc._id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#d8e2eb] bg-[#f8fafc] p-3 transition-colors hover:border-[#1282a2] hover:bg-white"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-extrabold text-[#0a1128]">
                            {svc.name}
                          </p>
                          <p className="truncate text-[11px] font-medium text-[#33415c]">
                            {svc.providerId?.businessName ||
                              "Verified Provider"}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs font-extrabold text-[#034078]">
                            {formatServicePrice(svc)}
                          </p>
                          <p className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#64748b]">
                            <Clock className="h-2.5 w-2.5 text-[#1282a2]" />
                            {svc.durationMinutes}m
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  to={`/services?categoryId=${result.recommendation.categoryId}`}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#034078] py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
                >
                  <span>Explore All {result.recommendation.categoryName}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Launcher Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#1282a2]/50 bg-[#0a1128] px-3.5 py-2.5 text-xs font-extrabold text-white shadow-lg transition-all hover:border-[#1282a2] hover:bg-[#001f54] sm:gap-2.5 sm:px-4 sm:py-3 sm:text-sm"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1282a2] text-white transition-transform group-hover:rotate-12 sm:h-8 sm:w-8">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        <span className="pr-1">
          {isOpen ? "Close AI" : "Ask DoorAssist AI"}
        </span>
      </button>
    </div>
  );
};

export default SmartServiceAssistant;
