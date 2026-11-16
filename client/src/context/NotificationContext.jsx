import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const NotificationContext = createContext(null);

const notificationStyles = {
  success: {
    Icon: CheckCircle2,
    containerClass:
      "border-emerald-200/80 bg-emerald-50/85 text-emerald-900 shadow-[0_10px_35px_rgba(16,185,129,0.16)]",
    badgeClass:
      "bg-emerald-100/90 text-emerald-600 ring-1 ring-inset ring-emerald-200/80",
    closeClass:
      "text-emerald-700/70 hover:bg-emerald-100/80 hover:text-emerald-900",
  },
  error: {
    Icon: AlertCircle,
    containerClass:
      "border-red-200/80 bg-red-50/85 text-red-900 shadow-[0_10px_35px_rgba(239,68,68,0.16)]",
    badgeClass: "bg-red-100/90 text-red-600 ring-1 ring-inset ring-red-200/80",
    closeClass: "text-red-700/70 hover:bg-red-100/80 hover:text-red-900",
  },
  info: {
    Icon: Info,
    containerClass:
      "border-[#bfcaff]/70 bg-white/85 text-slate-900 shadow-[0_10px_35px_rgba(203,189,255,0.28)]",
    badgeClass:
      "bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60",
    closeClass: "text-slate-500 hover:bg-[#cbbdff]/20 hover:text-slate-900",
  },
};

const NotificationItem = ({ notification, onClose }) => {
  const { id, message, type, duration } = notification;
  const { Icon, containerClass, badgeClass, closeClass } =
    notificationStyles[type];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose(id);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl border p-4 backdrop-blur-2xl transition-all duration-300 ${containerClass}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#e4a5ff]/15 blur-2xl"
      />

      <span
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${badgeClass}`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <p className="relative z-10 flex-1 pt-0.5 text-sm font-semibold leading-snug">
        {message}
      </p>

      <button
        type="button"
        onClick={() => onClose(id)}
        aria-label="Close notification"
        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors active:scale-95 ${closeClass}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const nextId = useRef(0);

  const showNotification = useCallback(
    (message, type = "info", duration = 4000) => {
      if (!message || !message.trim()) return;

      const validType = notificationStyles[type] ? type : "info";

      const notification = {
        id: ++nextId.current,
        message,
        type: validType,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);
    },
    [],
  );

  const closeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-100 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={closeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }

  return context;
};
