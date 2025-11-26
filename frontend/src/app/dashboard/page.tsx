"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/api/v1/users/me").then((r) => setUser(r.data)).catch(() => {});
  }, []);

  if (!user) return <p>Loading...</p>;

  const roleLabel =
    user.role === "superuser"
      ? "Superuser"
      : user.role === "master_admin"
      ? "Master Admin"
      : user.role === "normal_admin"
      ? "Admin"
      : "User";

  const stats = [
    {
      label: "User ID",
      value: user.id,
      badgeText: "Primary key",
      badgeClass: "badge-soft",
    },
    {
      label: "Role",
      value: roleLabel,
      badgeText: user.role,
      badgeClass: "badge-accent",
    },
    {
      label: "Status",
      value: user.is_active ? "Active" : "Disabled",
      badgeText: user.is_active ? "Operational" : "Locked",
      badgeClass: user.is_active ? "badge-success" : "badge-danger",
    },
  ];

  return (
    <div className="card section-panel">
      <div className="space-y-6">
        <div>
          <div className="panel-heading">
            <div>
              <p className="subtitle-muted">Dashboard overview</p>
              <h1 className="title is-3 mb-0">Welcome back, {user.email}</h1>
            </div>
            <span className="badge badge-accent">Live</span>
          </div>
          <p className="muted-caption">
            This CMS demo surfaces your account, role, and health in a single view.
          </p>
        </div>

        <div className="metric-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="metric-card">
              <div className="metric-label">{stat.label}</div>
              <div className="metric-value">{stat.value}</div>
              <span className={`badge ${stat.badgeClass}`}>{stat.badgeText}</span>
            </div>
          ))}
        </div>

        <div className="card section-panel space-y-4">
          <div className="panel-heading">
            <h2 className="title is-4 mb-0">Next steps</h2>
            <span className="badge badge-soft">Getting started</span>
          </div>
          <p className="muted-caption">
            Everything is powered by Bulma utilities layered with custom helpers.
          </p>
          <div className="panel-actions">
            <button className="button is-link">Create user</button>
            <button className="button is-light">View activity</button>
          </div>
        </div>
      </div>
    </div>
  );
}
