export const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export const formatNumber = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "0";
  return Number(value).toLocaleString("en-IN");
};

export const formatCurrency = (
  amount,
  currency = "INR",
  maximumFractionDigits = 0,
) => {
  if (amount == null || Number.isNaN(Number(amount))) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(Number(amount));
};

export const formatServicePrice = (service) => {
  if (!service) return "";

  if (service.pricingType === "on_request") {
    return "Price on Request";
  }

  if (service.price == null) {
    return "Price unavailable";
  }

  const price = formatCurrency(service.price);

  return service.pricingType === "starting_from"
    ? `Starting from ${price}`
    : price;
};

export const formatDateTime = (value, fallback = "Not available") => {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatLabel = (value) => {
  if (!value) return "";

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};
