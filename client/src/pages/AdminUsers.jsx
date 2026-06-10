import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  Download,
  Edit3,
  LockOpen,
  Mail,
  Phone,
  RefreshCw,
  RosetteDash,
  Save,
  Search,
  ShieldCheck,
  ShieldHalf,
  Trash2,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  deleteUser,
  getAdminUsers,
  suspendUser,
  unsuspendUser,
  updateUser,
} from "../services/adminApi";

const emptyEditForm = {
  name: "",
  email: "",
  phone: "",
  role: "USER",
  isVerified: false,
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [savingId, setSavingId] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const showStatus = (msg, isError = false) => {
    setStatus(msg);
    setStatusError(isError);
    setTimeout(() => setStatus(""), 3000);
  };

  const loadUsers = async () => {
    try {
      showStatus("Refreshing users…");
      const data = await getAdminUsers();
      setUsers(Array.isArray(data?.users) ? data.users : Array.isArray(data) ? data : []);
      showStatus("Users refreshed.");
    } catch (error) {
      console.error(error);
      setUsers([]);
      showStatus("Failed to load users.", true);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => !u.isSuspended).length,
    suspended: users.filter((u) => u.isSuspended).length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  }), [users]);

  const duplicateEmails = useMemo(() => {
    const counts = {};
    users.forEach((u) => {
      const email = u.email?.toLowerCase();
      if (email) counts[email] = (counts[email] || 0) + 1;
    });
    return counts;
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return users;
    return users.filter((u) =>
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term)
    );
  }, [users, search]);

  const startEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "USER",
      isVerified: Boolean(user.isVerified),
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm(emptyEditForm);
  };

  const updateEditForm = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const patchUserInState = (id, updated) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              ...updated,
              counts: user.counts,
              totalPurchases: user.totalPurchases,
              totalSpent: user.totalSpent,
              productsBought: user.productsBought,
              orders: user.orders,
              bookings: user.bookings,
            }
          : user
      )
    );
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      setSavingId(editingUser.id);
      const updated = await updateUser(editingUser.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
        phone: editForm.phone.trim(),
        role: editForm.role,
        isVerified: editForm.isVerified,
      });
      patchUserInState(editingUser.id, updated);
      showStatus("User updated successfully.");
      cancelEdit();
    } catch (error) {
      console.error(error);
      showStatus(error.response?.data?.message || "Failed to update user.", true);
    } finally {
      setSavingId("");
    }
  };

  const handleSuspend = async (user) => {
    try {
      const res = await suspendUser(user.id);
      patchUserInState(user.id, { ...(res.user || res), isSuspended: true });
      showStatus("User suspended.");
    } catch (error) {
      console.error(error);
      showStatus(error.response?.data?.message || "Failed to suspend user.", true);
    }
  };

  const handleUnsuspend = async (user) => {
    try {
      const res = await unsuspendUser(user.id);
      patchUserInState(user.id, { ...(res.user || res), isSuspended: false });
      showStatus("User unsuspended.");
    } catch (error) {
      console.error(error);
      showStatus(error.response?.data?.message || "Failed to unsuspend user.", true);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete ${user.email || "this user"}?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;
    try {
      setDeletingId(user.id);
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      showStatus("User deleted.");
    } catch (error) {
      console.error(error);
      showStatus(error.response?.data?.message || "Failed to delete user.", true);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section className="admin-users-page">
      {/* Header */}
      <header className="admin-users-header">
        <div>
          <p className="admin-eyebrow">
            <ShieldCheck size={13} />
            Admin Control
          </p>
          <h1>Manage <span>Users.</span></h1>
          <p>Edit users, suspend accounts, review purchases, and remove accounts when needed.</p>
        </div>
        <div className="header-actions">
          <button type="button" onClick={loadUsers} className="header-btn">
            <RefreshCw size={14} /> Refresh
          </button>
          <button type="button" className="header-btn export-btn">
            <Download size={14} /> Export
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon green"><Users size={17} /></div>
          <div><p className="stat-label">Total Users</p><p className="stat-val">{stats.total}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle2 size={17} /></div>
          <div><p className="stat-label">Active</p><p className="stat-val">{stats.active}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><Ban size={17} /></div>
          <div><p className="stat-label">Suspended</p><p className="stat-val">{stats.suspended}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><ShieldHalf size={17} /></div>
          <div><p className="stat-label">Admins</p><p className="stat-val">{stats.admins}</p></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="users-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search name, email, phone, or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="users-count">
          <Users size={15} />
          {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Status toast */}
      {status && (
        <p className={`admin-status ${statusError ? "error" : ""}`}>
          {statusError ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
          {status}
        </p>
      )}

      {/* Edit panel */}
      {editingUser && (
        <div className="edit-panel">
          <div className="edit-panel-header">
            <div>
              <h3><Edit3 size={15} /> Edit User</h3>
              <p>Orders and purchases stay read-only, as they should.</p>
            </div>
            <button type="button" className="close-edit-btn" onClick={cancelEdit}>
              <X size={15} />
            </button>
          </div>

          <div className="edit-grid">
            <label>
              <span><User size={11} /> Name</span>
              <input value={editForm.name} onChange={(e) => updateEditForm("name", e.target.value)} placeholder="User name" />
            </label>
            <label>
              <span><Mail size={11} /> Email</span>
              <input type="email" value={editForm.email} onChange={(e) => updateEditForm("email", e.target.value)} placeholder="email@example.com" />
            </label>
            <label>
              <span><Phone size={11} /> Phone</span>
              <input value={editForm.phone} onChange={(e) => updateEditForm("phone", e.target.value)} placeholder="Phone number" />
            </label>
            <label>
              <span><ShieldCheck size={11} /> Role</span>
              <select value={editForm.role} onChange={(e) => updateEditForm("role", e.target.value)}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={editForm.isVerified} onChange={(e) => updateEditForm("isVerified", e.target.checked)} />
              <span>Mark as verified user</span>
            </label>
          </div>

          <div className="edit-actions">
            <button type="button" className="cancel-btn" onClick={cancelEdit}>
              <X size={14} /> Cancel
            </button>
            <button type="button" className="save-btn" disabled={savingId === editingUser.id} onClick={handleSave}>
              <Save size={14} />
              {savingId === editingUser.id ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Purchases</th>
              <th>Orders</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const emailKey = user.email?.toLowerCase();
                const isDuplicate = emailKey && duplicateEmails[emailKey] > 1;
                return (
                  <tr key={user.id} className={isDuplicate ? "duplicate-row" : ""}>
                    <td>
                      <div className="user-cell">
                        <div className={`avatar ${user.role === "ADMIN" ? "admin" : ""}`}>
                          <User size={15} />
                        </div>
                        <div>
                          <strong>{user.name || "No Name"}</strong>
                          <span className="user-id">{user.id}</span>
                          {isDuplicate && <em className="duplicate-badge">Duplicate</em>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="icon-text"><Mail size={13} />{user.email || "N/A"}</span>
                    </td>
                    <td>
                      <span className="icon-text"><Phone size={13} />{user.phone || "N/A"}</span>
                    </td>
                    <td>
                      <span className={`role-badge ${user.role?.toLowerCase() || "user"}`}>
                        {user.role === "ADMIN" ? <ShieldHalf size={11} /> : <User size={11} />}
                        {user.role || "USER"}
                      </span>
                    </td>
                    <td>
                      {user.isSuspended ? (
                        <span className="status-badge suspended"><Ban size={11} /> Suspended</span>
                      ) : (
                        <span className="status-badge active"><CheckCircle2 size={11} /> Active</span>
                      )}
                    </td>
                    <td>
                      {user.isVerified
                        ? <CheckCircle2 size={16} className="verified-icon" />
                        : <XCircle size={16} className="unverified-icon" />
                      }
                    </td>
                    <td><strong>{user.counts?.purchases ?? user.totalPurchases ?? 0}</strong></td>
                    <td><strong>{user.counts?.orders ?? user.orders?.length ?? 0}</strong></td>
                    <td className="date-cell">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                    </td>
                    <td>
                      <div className="action-group">
                        <button
                          type="button"
                          className="act-btn edit"
                          title="Edit user"
                          onClick={() => startEdit(user)}
                        >
                          <Edit3 size={14} />
                        </button>

                        {user.isSuspended ? (
                          <button
                            type="button"
                            className="act-btn unsuspend"
                            title="Unsuspend user"
                            onClick={() => handleUnsuspend(user)}
                          >
                            <LockOpen size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="act-btn suspend"
                            title="Suspend user"
                            onClick={() => handleSuspend(user)}
                          >
                            <Ban size={14} />
                          </button>
                        )}

                        <button
                          type="button"
                          className="act-btn delete"
                          title="Delete user"
                          disabled={deletingId === user.id}
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="empty-cell">
                  <Users size={28} />
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        * { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        *::-webkit-scrollbar-corner { background: transparent; }

        .admin-users-page {
          padding: 16px 0 40px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── Header ── */
        .admin-users-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 14px;
          padding: 20px 22px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .admin-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 8px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.2);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .admin-users-header h1 {
          margin: 0;
          font-size: clamp(1.8rem, 3.4vw, 2.75rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
          color: var(--text);
        }

        .admin-users-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-users-header > div > p {
          max-width: 520px;
          margin: 7px 0 0;
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .header-actions { display: flex; gap: 8px; flex-shrink: 0; }

        .header-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 0.78rem;
          white-space: nowrap;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-weight: 850;
        }

        .export-btn {
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          border-color: rgba(22,163,74,0.2);
        }

        /* ── Stats ── */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 16px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .stat-icon.green { background: rgba(22,163,74,0.12); color: #16a34a; }
        .stat-icon.red   { background: rgba(239,68,68,0.12);  color: #ef4444; }
        .stat-icon.amber { background: rgba(214,179,0,0.14);  color: #b89400; }

        .stat-label {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted);
          margin: 0;
        }

        .stat-val {
          font-size: 1.35rem;
          font-weight: 950;
          color: var(--text);
          line-height: 1.1;
          margin: 0;
        }

        /* ── Toolbar ── */
        .users-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .users-search {
          flex: 1;
          min-width: 260px;
          min-height: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px;
          border-radius: 999px;
          background: var(--card);
          border: 1px solid var(--border);
          color: #16a34a;
        }

        .users-search:focus-within {
          border-color: rgba(22,163,74,0.55);
          box-shadow: 0 0 0 3px rgba(22,163,74,0.08);
        }

        .users-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.84rem;
          font-weight: 700;
        }

        .users-count {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          border-radius: 999px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          font-weight: 900;
          font-size: 0.78rem;
          border: 1px solid rgba(22,163,74,0.18);
        }

        /* ── Status toast ── */
        .admin-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.79rem;
          font-weight: 700;
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.2);
        }

        .admin-status.error {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
          border-color: rgba(239,68,68,0.2);
        }

        /* ── Edit panel ── */
        .edit-panel {
          padding: 18px;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid rgba(22,163,74,0.25);
          box-shadow: 0 0 0 3px rgba(22,163,74,0.07);
        }

        .edit-panel-header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .edit-panel-header h3 {
          margin: 0;
          color: var(--text);
          font-size: 0.95rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .edit-panel-header h3 svg { color: #16a34a; }

        .edit-panel-header p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 0.77rem;
          line-height: 1.45;
        }

        .close-edit-btn {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          flex-shrink: 0;
        }

        .edit-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .edit-grid label {
          display: grid;
          gap: 5px;
        }

        .edit-grid label span {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--muted);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .edit-grid input,
        .edit-grid select {
          min-height: 40px;
          border: 1px solid var(--border);
          border-radius: 11px;
          background: var(--bg);
          color: var(--text);
          padding: 8px 12px;
          outline: none;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .edit-grid input:focus,
        .edit-grid select:focus {
          border-color: rgba(22,163,74,0.55);
          box-shadow: 0 0 0 3px rgba(22,163,74,0.08);
        }

        .checkbox-label {
          display: flex !important;
          flex-direction: row !important;
          align-items: center;
          gap: 8px !important;
        }

        .checkbox-label input { width: 15px; height: 15px; accent-color: #16a34a; min-height: auto; }
        .checkbox-label span { font-size: 0.82rem; font-weight: 700; }

        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }

        .cancel-btn, .save-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.78rem;
          font-weight: 900;
          border: 0;
        }

        .cancel-btn {
          background: var(--bg);
          color: var(--muted);
          border: 1px solid var(--border);
        }

        .save-btn { background: #16a34a; color: #fff; }
        .save-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Table ── */
        .users-table-wrap {
          overflow-x: auto;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .users-table {
          width: 100%;
          min-width: 1080px;
          border-collapse: collapse;
        }

        .users-table th,
        .users-table td {
          padding: 11px 13px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          font-size: 0.8rem;
          color: var(--text);
          vertical-align: middle;
        }

        .users-table th {
          color: var(--muted);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          font-weight: 950;
          background: rgba(22,163,74,0.04);
          white-space: nowrap;
        }

        .users-table tr:last-child td { border-bottom: 0; }

        .users-table tbody tr { transition: background 0.15s ease; }
        .users-table tbody tr:hover { background: rgba(22,163,74,0.025); }
        .duplicate-row { background: rgba(239,68,68,0.03); }

        /* ── User cell ── */
        .user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 200px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          flex-shrink: 0;
        }

        .avatar.admin {
          background: rgba(214,179,0,0.14);
          color: #b89400;
        }

        .user-cell strong {
          display: block;
          font-size: 0.84rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1.2;
        }

        .user-id {
          display: block;
          font-size: 11px;
          color: var(--muted);
          font-family: monospace;
          margin-top: 1px;
        }

        .duplicate-badge {
          display: inline-flex;
          margin-top: 3px;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(239,68,68,0.12);
          color: #ef4444;
          border: 1px solid rgba(239,68,68,0.2);
          font-style: normal;
          font-size: 10px;
          font-weight: 900;
        }

        /* ── Badges ── */
        .icon-text {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          max-width: 200px;
          color: var(--muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .role-badge, .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .role-badge.user   { background: rgba(22,163,74,0.12); color: #16a34a; border: 1px solid rgba(22,163,74,0.18); }
        .role-badge.admin  { background: rgba(214,179,0,0.14); color: #b89400; border: 1px solid rgba(214,179,0,0.22); }
        .status-badge.active     { background: rgba(22,163,74,0.12); color: #16a34a; border: 1px solid rgba(22,163,74,0.18); }
        .status-badge.suspended  { background: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }

        .verified-icon   { color: #16a34a; display: block; }
        .unverified-icon { color: var(--border); display: block; }

        .date-cell { color: var(--muted); font-size: 11px; white-space: nowrap; }

        /* ── Icon-only action buttons ── */
        .action-group { display: flex; gap: 5px; }

        .act-btn {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 9px;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          flex-shrink: 0;
        }

        .act-btn:hover  { opacity: 0.8; transform: scale(1.07); }
        .act-btn:active { transform: scale(0.95); }
        .act-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .act-btn.edit     { background: rgba(59,130,246,0.12); color: #3b82f6; }
        .act-btn.suspend  { background: rgba(245,158,11,0.14); color: #d97706; }
        .act-btn.unsuspend{ background: rgba(22,163,74,0.12);  color: #16a34a; }
        .act-btn.delete   { background: rgba(239,68,68,0.12);  color: #ef4444; }

        /* ── Empty state ── */
        .empty-cell {
          text-align: center !important;
          color: var(--muted) !important;
          font-weight: 800;
          padding: 32px !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        /* ── Responsive ── */
        @media (max-width: 760px) {
          .admin-users-page { padding-top: 10px; }

          .admin-users-header {
            flex-direction: column;
            align-items: flex-start;
            padding: 16px;
          }

          .header-actions { width: 100%; }
          .header-btn { flex: 1; justify-content: center; }

          .stats-row { grid-template-columns: repeat(2, 1fr); }

          .users-search { min-width: 100%; }
          .users-count  { width: 100%; justify-content: center; }

          .edit-grid { grid-template-columns: 1fr; }

          .edit-actions { flex-direction: column; }
          .cancel-btn, .save-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default AdminUsers;