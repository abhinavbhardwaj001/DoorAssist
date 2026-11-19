import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RoleRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center bg-[#fefcfb]"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d8e2eb] border-t-[#1282a2]" />
        <span className="sr-only">Verifying access...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
