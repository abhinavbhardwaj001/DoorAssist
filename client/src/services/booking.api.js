import api from "./api";

export const createBooking = (data) => {
  return api.post("/bookings", data);
};

export const getMyBookings = () => {
  return api.get("/bookings/my-bookings");
};

export const getBookingById = (bookingId) => {
  return api.get(`/bookings/${bookingId}`);
};

export const cancelBooking = (bookingId, cancellationReason) => {
  return api.patch(`/bookings/${bookingId}/cancel`, {
    cancellationReason,
  });
};

export const getProviderBookings = () => {
  return api.get("/bookings/provider-bookings");
};

export const acceptBooking = (bookingId) => {
  return api.patch(`/bookings/${bookingId}/accept`);
};

export const rejectBooking = (bookingId, rejectionReason) => {
  return api.patch(`/bookings/${bookingId}/reject`, {
    rejectionReason,
  });
};

export const startBooking = (bookingId) => {
  return api.patch(`/bookings/${bookingId}/start`);
};

export const completeBooking = (bookingId) => {
  return api.patch(`/bookings/${bookingId}/complete`);
};
