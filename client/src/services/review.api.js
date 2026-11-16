import api from "./api";

export const getProviderReviews = (providerId) => {
  return api.get(`/reviews/provider/${providerId}`);
};

export const createReview = (data) => {
  return api.post("/reviews", data);
};
