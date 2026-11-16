import api from "./api";

export const diagnoseHomeIssue = (problem) => {
  return api.post("/ai/diagnose", { problem });
};

export const generateServiceCopy = (payload) => {
  return api.post("/ai/generate-service-copy", payload);
};
