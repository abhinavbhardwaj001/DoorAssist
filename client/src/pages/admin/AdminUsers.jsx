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
  admin:
    "border-[#deabff]/70 bg-linear-to-r from-[#e4a5ff]/25 via-[#cbbdff]/25 to-[#acdcff]/25 text-slate-900",
  provider: "border-[#bfcaff]/60 bg-[#acdcff]/25 text-slate-800",
  customer: "border-slate-200/80 bg-white/80 text-slate-700",
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
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          title="Manage Users"
          subtitle="Search user accounts, filter by role or status, and manage account access."
        />

        {/* Search and Filters */}
        <div className="relative mt-8 overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-5 shadow-[0_8px_40px_rgba(203,189,255,0.18)] backdrop-blur-2xl sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#e4a5ff]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-[#acdcff]/25 blur-3xl"
          />

          <div className="relative z-10">
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
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Role
                </label>

                <div className="relative">
                  <select
                    id="roleFilter"
                    value={role}
                    onChange={handleRoleChange}
                    className="w-full appearance-none rounded-2xl border border-[#bfcaff]/50 bg-white/75 px-4 py-3 pr-10 text-sm font-medium text-slate-800 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30"
                  >
                    <option value="">All Roles</option>
                    {roleOptions.map((item) => (
                      <option key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="statusFilter"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Status
                </label>

                <div className="relative">
                  <select
                    id="statusFilter"
                    value={status}
                    onChange={handleStatusFilterChange}
                    className="w-full appearance-none rounded-2xl border border-[#bfcaff]/50 bg-white/75 px-4 py-3 pr-10 text-sm font-medium text-slate-800 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map((item) => (
                      <option key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <FetchErrorBanner message={fetchError} onRetry={() => fetchUsers()} />

        {/* Table Card */}
        <div className="relative mt-6 overflow-hidden rounded-4xl border border-white/75 bg-white/80 shadow-[0_8px_40px_rgba(203,189,255,0.18)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#bfcaff]/30 px-6 py-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                <Users className="h-4 w-4" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                User Accounts
              </h2>
            </div>

            <span className="rounded-full border border-[#bfcaff]/40 bg-white/75 px-3.5 py-1 text-xs font-bold text-slate-600">
              Total: {loading ? "..." : pagination.total}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left text-sm">
              <thead className="border-b border-[#bfcaff]/30 bg-linear-to-r from-[#e4a5ff]/10 via-[#cbbdff]/10 to-[#acdcff]/10 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#bfcaff]/25">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-14 text-center font-medium text-slate-500"
                    >
                      <div className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#7c56a8]" />
                        <span>Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-14 text-center font-medium text-slate-500"
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
                        className="transition-colors hover:bg-white/75"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-xs font-extrabold text-slate-900 ring-1 ring-inset ring-[#deabff]/50">
                              {initial}
                            </div>

                            <div>
                              <p className="font-bold text-slate-900">
                                {user.name}
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-slate-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${
                              roleStyles[user.role] || roleStyles.customer
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={user.status} />
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-600">
                          {formatDate(user.createdAt)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openStatusDialog(user)}
                            disabled={Boolean(updatingId)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#bfcaff]/60 bg-white/80 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-linear-to-r hover:from-[#e4a5ff]/20 hover:to-[#acdcff]/20 hover:text-slate-900 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                          >
                            <UserCog className="h-3.5 w-3.5 text-[#7c56a8]" />
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
            <div className="border-t border-[#bfcaff]/30 px-6 py-4">
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
              className="rounded-xl border border-[#bfcaff]/50 bg-white/75 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                Boolean(updatingId) || newStatus === selectedUser?.status
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:brightness-105 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
            >
              {updatingId && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{updatingId ? "Updating..." : "Confirm"}</span>
            </button>
          </>
        }
      >
        <p className="text-sm font-medium text-slate-600">
          Change the account status for{" "}
          <strong className="font-bold text-slate-900">
            {selectedUser?.name}
          </strong>
          .
        </p>

        <div className="mt-5">
          <label
            htmlFor="newUserStatus"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            New Status
          </label>

          <div className="relative mt-2">
            <select
              id="newUserStatus"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-[#bfcaff]/50 bg-white/75 px-4 py-3 pr-10 text-sm font-semibold capitalize text-slate-800 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200/80 bg-amber-50/85 p-3.5 text-xs font-semibold text-amber-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
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
