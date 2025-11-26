"use client";

import { useEffect, useState } from "react";
import { api, API_PREFIX } from "@/lib/api";

const roleLabel = (role: string) => {
  if (role === "superuser") return "Superuser";
  if (role === "master_admin") return "Master Admin";
  if (role === "normal_admin") return "Admin";
  return "User";
};

const getInitials = (email: string) => {
  if (!email) return "?";
  return email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api
      .get(`${API_PREFIX}/users`)
      .then((r) => setUsers(r.data))
      .catch(() => {});
  }, []);

  const activeCount = users.filter((u) => u.is_active).length;
  const disabledCount = users.filter((u) => !u.is_active).length;
  const adminCount = users.filter((u) => u.role !== "user").length;

  const stats = [
    { label: "Total users", value: users.length, caption: "All records" },
    { label: "Active", value: activeCount, caption: "Operational" },
    { label: "Disabled", value: disabledCount, caption: "Requires attention" },
    { label: "Admins", value: adminCount, caption: "Elevated access" },
  ];

  return (
    <div className="section users-shell">
      <section className="card section-panel users-hero">
        <div className="panel-heading">
          <div>
            <p className="subtitle-muted">Admin-only view</p>
            <h1 className="title is-3 mb-0">User Management</h1>
          </div>
          <span className="badge badge-accent">Live</span>
        </div>
        <p className="muted-caption">
          Monitor roles, status, and health of every account.
        </p>
        <div className="metric-grid users-metric-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="metric-card">
              <div className="metric-label">{stat.label}</div>
              <div className="metric-value">{stat.value}</div>
              <span className="metric-caption">{stat.caption}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card section-panel users-toolbar-card">
        <div className="users-toolbar">
          <div className="users-toolbar-fields">
            <label className="subtitle-muted">Directory search</label>
            <input className="input input-glass" placeholder="Search by email or ID" />
          </div>
          <div className="users-toolbar-chips" aria-hidden="true">
            <span className="chip chip-soft">All statuses</span>
            <span className="chip chip-soft">All roles</span>
            <span className="chip chip-soft">Any activity</span>
          </div>
          <div className="users-toolbar-action">
            <button className="button is-link">Invite user</button>
          </div>
        </div>
      </section>

      <section className="card section-panel users-directory">
        <div className="panel-heading">
          <div>
            <p className="subtitle-muted">Directory</p>
            <h2 className="title is-4 mb-0">All accounts</h2>
          </div>
          <span className="badge badge-soft">Realtime</span>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <p className="subtitle-muted">No users found</p>
            <p className="muted-caption">
              Once users are created, they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="users-list">
            {users.map((u) => (
              <article
                key={u.id}
                className="user-card"
                onClick={() => (window.location.href = `/dashboard/users/${u.id}`)}
              >
                <div className="user-card-primary">
                  <span className="avatar-pill">{getInitials(u.email)}</span>
                  <div>
                    <p className="user-email">{u.email}</p>
                    <p className="user-id-label">ID {u.id}</p>
                  </div>
                </div>

                <div className="user-card-meta">
                  <div className="user-meta-block">
                    <span className="meta-label">Status</span>
                    <span
                      className={`status-pill ${u.is_active ? "is-success" : "is-danger"}`}
                    >
                      {u.is_active ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="user-meta-block">
                    <span className="meta-label">Role</span>
                    <span className="pill-outline">{roleLabel(u.role)}</span>
                  </div>

                  <div className="user-meta-block">
                    <span className="meta-label">User ID</span>
                    <span className="pill-soft">{u.id}</span>
                  </div>
                </div>

                <div className="user-card-actions">
                  <button className="button is-small is-white is-outlined">Edit</button>
                  <button className="button is-small is-danger is-light">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
