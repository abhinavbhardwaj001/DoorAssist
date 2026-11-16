const isValidObjectId = (id) =>
  typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

export const validateBookingId = (bookingId) => {
  if (!isValidObjectId(bookingId)) {
    const error = new Error("Invalid booking ID");
    error.statusCode = 400;
    throw error;
  }
};

export const validateProviderId = (providerId) => {
  if (!isValidObjectId(providerId)) {
    const error = new Error("Invalid provider ID");
    error.statusCode = 400;
    throw error;
  }
};

export const validateServiceId = (serviceId) => {
  if (!isValidObjectId(serviceId)) {
    const error = new Error("Invalid service ID");
    error.statusCode = 400;
    throw error;
  }
};

export const validateCategoryId = (categoryId) => {
  if (!isValidObjectId(categoryId)) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }
};
