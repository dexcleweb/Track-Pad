import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { getAdminUsers } from "../services/adminApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("Loading users...");
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setStatus("Loading users...");
      const data = await getAdminUsers();

      setUsers(data.users || data || []);
      setStatus("");
    } catch (error) {
      console.error(error);
      setUsers([]);
      setStatus("Failed to load users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return users;

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  return (
    <section className="admin-users-page">
      <header className="admin-users-header">
        <div>
          <p className="admin-eyebrow">
            <ShieldCheck size={13} /> Admin Control
          </p>

          <h1>
            Manage <span>Users.</span>
          </h1>

          <p>
            View registered users, contact details, roles, purchases, and account
            activity from one place.
          </p>
        </div>

        <button type="button" onClick={loadUsers} className="refresh-btn">
          <RefreshCw size={14} /> Refresh
        </button>
      </header>

      <div className="users-toolbar">
        <div className="users-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search users by name, email, phone, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="users-count">
          <Users size={16} />
          {filteredUsers.length} Users
        </div>
      </div>

      {status && <p className="admin-status">{status}</p>}

      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Purchases</th>
              <th>Orders</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">
                        <User size={16} />
                      </div>
                      <div>
                        <strong>{user.name || "No Name"}</strong>
                        <span>ID: {user.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="icon-text">
                      <Mail size={14} />
                      {user.email || "N/A"}
                    </span>
                  </td>

                  <td>
                    <span className="icon-text">
                      <Phone size={14} />
                      {user.phone || "N/A"}
                    </span>
                  </td>

                  <td>
                    <span className={`role-badge ${user.role || "user"}`}>
                      {user.role || "USER"}
                    </span>
                  </td>

                  <td>{user._count?.purchases ?? user.purchases?.length ?? 0}</td>

                  <td>{user._count?.orders ?? user.orders?.length ?? 0}</td>

                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-cell">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-users-page {
          padding: 18px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .admin-users-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 16px;
          margin-bottom: 14px;
          padding: 20px;
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(22,163,74,0.1), rgba(245,216,0,0.045)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .admin-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 8px;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.18);
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .admin-users-header h1 {
          margin: 0;
          font-size: clamp(1.9rem,3.8vw,3rem);
          line-height: 1;
          font-weight: 950;
          color: var(--text);
        }

        .admin-users-header h1 span {
          background: linear-gradient(120deg,#16a34a,#d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-users-header p {
          max-width: 620px;
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 12px;
          font-size: 0.82rem;
          white-space: nowrap;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-weight: 850;
        }

        .users-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .users-search {
          flex: 1;
          min-width: 260px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 13px;
          border-radius: 999px;
          background: var(--card);
          border: 1px solid var(--border);
        }

        .users-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.9rem;
        }

        .users-count {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 13px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          font-weight: 900;
          font-size: 0.82rem;
          border: 1px solid rgba(22,163,74,0.18);
        }

        .admin-status {
          margin: 0 0 12px;
          color: var(--muted);
          font-weight: 700;
          font-size: 0.84rem;
        }

        .users-table-wrap {
          overflow-x: auto;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 920px;
        }

        .users-table th,
        .users-table td {
          padding: 14px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          font-size: 0.84rem;
          color: var(--text);
        }

        .users-table th {
          color: var(--muted);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 950;
          background: var(--bg);
        }

        .users-table tr:last-child td {
          border-bottom: 0;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          flex-shrink: 0;
        }

        .user-cell strong {
          display: block;
          font-size: 0.9rem;
          color: var(--text);
        }

        .user-cell span {
          display: block;
          margin-top: 3px;
          font-size: 0.72rem;
          color: var(--muted);
        }

        .icon-text {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--muted);
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 950;
          text-transform: uppercase;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.18);
        }

        .role-badge.admin {
          background: rgba(214,179,0,0.14);
          color: #b89400;
          border-color: rgba(214,179,0,0.24);
        }

        .empty-cell {
          text-align: center !important;
          color: var(--muted) !important;
          font-weight: 800;
          padding: 28px !important;
        }

        @media (max-width: 760px) {
          .admin-users-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .refresh-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminUsers;