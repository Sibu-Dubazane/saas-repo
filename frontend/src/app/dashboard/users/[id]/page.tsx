"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

export default function UserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((r) => setUser(r.data))
      .catch(() => setErr("Failed to load user"));
  }, [id]);

  if (err) {
    return (
      <section className="section">
        <div className="container">
          <p className="has-text-danger">{err}</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-3 mb-5">User Profile</h1>

        <div className="card section-panel space-y-4">
          <div className="panel-heading">
            <div>
              <h2 className="title is-4 mb-0">Account overview</h2>
              <span className="subtitle-muted">#{user.id}</span>
            </div>
            <span className="badge badge-soft">User profile</span>
          </div>

          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Email</div>
              <div className="metric-value">{user.email}</div>
              <span className="badge badge-accent">Primary</span>
            </div>
            <div className="metric-card">
              <div className="metric-label">Status</div>
              <div className="metric-value">
                {user.is_active ? "Active" : "Disabled"}
              </div>
              <span className={`badge ${user.is_active ? "badge-success" : "badge-danger"}`}>
                {user.is_active ? "Operational" : "Locked"}
              </span>
            </div>
            <div className="metric-card">
              <div className="metric-label">Role</div>
              <div className="metric-value">
                {user.role === "superuser"
                  ? "Superuser"
                  : user.role === "master_admin"
                  ? "Master Admin"
                  : user.role === "normal_admin"
                  ? "Admin"
                  : "User"}
              </div>
              <span className="badge badge-soft">{user.role}</span>
            </div>
          </div>

          {user.created_at && (
            <div className="card section-panel space-y-2">
              <p><strong>Created at:</strong> {user.created_at}</p>
              <p><strong>Updated at:</strong> {user.updated_at}</p>
            </div>
          )}

          <div className="panel-actions">
            <button className="button is-info">Edit profile</button>
            <button className="button is-danger is-light">Suspend</button>
          </div>
        </div> 
      </div>
    </section>
  );
}
