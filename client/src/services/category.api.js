import api from "./api";

export const getActiveCategories = () => {
  return api.get("/categories");
};
