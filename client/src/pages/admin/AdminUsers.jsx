import { useCallback, useEffect, useState } from "react";
import {
  Users,
  ChevronDown,
  UserCog,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { getAllUsers, updateUserStatus } from "../../services/admin.api";
import { useNotification } from "../../context/NotificationContext";
import { formatDate } from "../../utils/formatters";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/BookingStatusBadge";
import ModalDialog from "../../components/common/ModalDialog";
import Pagination from "../../components/common/Pagination";

const roleOptions = ["customer", "provider", "admin"];
const statusOptions = ["active", "suspended", "blocked"];

const roleStyles = {
  admin: "border-[#0a1128] bg-[#0a1128] text-white",
  provider: "border-[#1282a2]/30 bg-[#1282a2]/10 text-[#034078]",
  customer: "border-[#d8e2eb] bg-[#f4f7fa] text-[#33415c]",
};

const AdminUsers = () => {
  const { showNotification } = useNotification();

  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [fetchError, setFetchError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const fetchUsers = useCallback(
    async (signal) => {
      setLoading(true);
      setFetchError("");

      try {
        const response = await getAllUsers({
          page,
          limit: 10,
          ...(role && { role }),
          ...(status && { status }),
          ...(search && { search }),
        });

        if (signal?.aborted) return;

        const result = response.data.data;

        setUsers(Array.isArray(result.users) ? result.users : []);

        setPagination({
          total: result.pagination.totalUsers,
          totalPages: Math.max(1, result.pagination.totalPages),
        });
      } catch (err) {
        if (signal?.aborted) return;

        setFetchError(err.response?.data?.message || "Unable to fetch users.");
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [page, role, status, search],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchUsers(controller.signal);

    return () => controller.abort();
  }, [fetchUsers]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const openStatusDialog = (user) => {
    setSelectedUser(user);
    setNewStatus(user.status);
  };

  const closeStatusDialog = () => {
    if (updatingId) return;
    setSelectedUser(null);
    setNewStatus("");
  };

  const handleStatusUpdate = async (event) => {
    event.preventDefault();

    if (
      !selectedUser ||
      !newStatus ||
      newStatus === selectedUser.status ||
      updatingId
    ) {
      return;
    }

    setUpdatingId(selectedUser._id);

    try {
      const response = await updateUserStatus(selectedUser._id, newStatus);

      setSelectedUser(null);
      showNotification(
        response?.data?.message || "User status updated successfully.",
        "success",
      );

      await fetchUsers();
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Unable to update user status.",
        "error",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          title="Manage Users"
          subtitle="Search user accounts, filter by role or status, and manage account access."
        />

        {/* Search and Filters */}
        <div className="mt-8 rounded-2xl border border-[#d8e2eb] bg-white p-5 shadow-xs sm:p-6">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearch}
            placeholder="Search by name or email..."
            ariaLabel="Search users"
          />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="roleFilter"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0a1128]"
              >
                Role
              </label>

              <div className="relative">
                <select
                  id="roleFilter"
                  value={role}
                  onChange={handleRoleChange}
                  className="w-full appearance-none rounded-xl border border-[#cbd5e1] bg-[#fefcfb] px-4 py-3 pr-10 text-sm font-medium text-[#0a1128] transition-all outline-none focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
                >
                  <option value="">All Roles</option>
                  {roleOptions.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#33415c]" />
              </div>
            </div>

            <div>
              <label
                htmlFor="statusFilter"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0a1128]"
              >
                Status
              </label>

              <div className="relative">
                <select
                  id="statusFilter"
                  value={status}
                  onChange={handleStatusFilterChange}
                  className="w-full appearance-none rounded-xl border border-[#cbd5e1] bg-[#fefcfb] px-4 py-3 pr-10 text-sm font-medium text-[#0a1128] transition-all outline-none focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#33415c]" />
              </div>
            </div>
          </div>
        </div>

        <FetchErrorBanner message={fetchError} onRetry={() => fetchUsers()} />

        {/* Table Card */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#d8e2eb] bg-white shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0] px-6 py-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                <Users className="h-4 w-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0a1128] sm:text-lg">
                User Accounts
              </h2>
            </div>

            <span className="rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1 text-xs font-bold text-[#034078]">
              Total: {loading ? "..." : pagination.total}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left text-sm">
              <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-xs font-bold uppercase tracking-wider text-[#64748b]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e2e8f0]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-14 text-center font-medium text-[#33415c]"
                    >
                      <div className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#034078]" />
                        <span>Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-14 text-center font-medium text-[#33415c]"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const initial = user.name?.charAt(0)?.toUpperCase() || "U";

                    return (
                      <tr
                        key={user._id}
                        className="transition-colors hover:bg-[#f8fafc]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-xs font-extrabold text-[#034078]">
                              {initial}
                            </div>

                            <div>
                              <p className="font-bold text-[#0a1128]">
                                {user.name}
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-[#64748b]">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold capitalize ${
                              roleStyles[user.role] || roleStyles.customer
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={user.status} />
                        </td>

                        <td className="px-6 py-4 font-medium text-[#33415c]">
                          {formatDate(user.createdAt)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openStatusDialog(user)}
                            disabled={Boolean(updatingId)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-2 text-xs font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] disabled:pointer-events-none disabled:opacity-50"
                          >
                            <UserCog className="h-3.5 w-3.5 text-[#1282a2]" />
                            <span>Change Status</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="border-t border-[#e2e8f0] px-6 py-4">
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                loading={loading}
                className="flex flex-wrap items-center justify-between gap-4"
              />
            </div>
          )}
        </div>
      </div>

      {/* Status Confirmation Modal */}
      <ModalDialog
        open={Boolean(selectedUser)}
        onClose={closeStatusDialog}
        onSubmit={handleStatusUpdate}
        disabled={Boolean(updatingId)}
        titleId="status-dialog-title"
        title="Update User Status"
        icon={UserCog}
        footer={
          <>
            <button
              type="button"
              onClick={closeStatusDialog}
              disabled={Boolean(updatingId)}
              className="cursor-pointer rounded-xl border border-[#cbd5e1] bg-white px-5 py-2.5 text-sm font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                Boolean(updatingId) || newStatus === selectedUser?.status
              }
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-55"
            >
              {updatingId && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{updatingId ? "Updating..." : "Confirm"}</span>
            </button>
          </>
        }
      >
        <p className="text-sm font-medium text-[#33415c]">
          Change the account status for{" "}
          <strong className="font-bold text-[#0a1128]">
            {selectedUser?.name}
          </strong>
          .
        </p>

        <div className="mt-5">
          <label
            htmlFor="newUserStatus"
            className="block text-xs font-bold uppercase tracking-wider text-[#0a1128]"
          >
            New Status
          </label>

          <div className="relative mt-2">
            <select
              id="newUserStatus"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#cbd5e1] bg-[#fefcfb] px-4 py-3 pr-10 text-sm font-semibold capitalize text-[#0a1128] transition-all outline-none focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#33415c]" />
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold text-amber-900">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <span>
            Suspending or blocking an account may prevent that user from
            accessing DoorAssist.
          </span>
        </div>
      </ModalDialog>
    </div>
  );
};

export default AdminUsers;
