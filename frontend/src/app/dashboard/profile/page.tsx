"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/api/v1/users/me").then((r) => setUser(r.data));
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

  const highlightStats = [
    { label: "Email", value: user.email },
    { label: "Role", value: roleLabel },
    { label: "Status", value: user.is_active ? "Active" : "Disabled" },
  ];

  return (
    <div className="section">
      <div className="card section-panel space-y-6">
        <div className="panel-heading">
          <div>
            <p className="subtitle-muted">My profile</p>
            <h1 className="title is-3 mb-0">{user.email}</h1>
          </div>
          <span className="badge badge-accent">Account</span>
        </div>

        <div className="metric-grid">
          {highlightStats.map((stat) => (
            <div key={stat.label} className="metric-card">
              <div className="metric-label">{stat.label}</div>
              <div className="metric-value">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="card section-panel">
          <div className="panel-heading">
            <div>
              <h2 className="title is-4 mb-0">Security details</h2>
              <span className="subtitle-muted">Updated automatically</span>
            </div>
            <span className="badge badge-soft">
              {user.is_active ? "Live" : "Inactive"}
            </span>
          </div>
          <div className="muted-caption">
            User ID: <strong>{user.id}</strong>
          </div>
          {user.created_at && (
            <div className="space-y-1">
              <p className="muted-caption">
                Created: <strong>{new Date(user.created_at).toLocaleString()}</strong>
              </p>
              <p className="muted-caption">
                Updated: <strong>{new Date(user.updated_at).toLocaleString()}</strong>
              </p>
            </div>
          )}
        </div>

        <div className="panel-actions">
          <button className="button is-link">Edit profile</button>
          <button className="button is-light">Audit logs</button>
        </div>
      </div>
    </div>
  );
}
