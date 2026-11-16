import api from "./api";

export const getMyPayments = () => {
  return api.get("/payments");
};

export const getPaymentByBooking = (bookingId) => {
  return api.get(`/payments/${bookingId}`);
};

export const initiatePayment = (bookingId) => {
  return api.post(`/payments/${bookingId}/initiate`);
};

export const simulatePayment = (bookingId, data) => {
  return api.post(`/payments/${bookingId}/simulate`, data);
};
