export const getDashboardPathByRole = (role) => {
  if (role === "admin") return "/admin";
  if (role === "provider") return "/provider/dashboard";
  return "/dashboard";
};
