"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const getInitials = (email?: string) => {
  if (!email) return "?";
  return email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();
};

export default function Topbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/api/v1/users/me").then((r) => setUser(r.data)).catch(() => {});
  }, []);

  const isAdmin =
    user && ["superuser", "master_admin", "normal_admin"].includes(user.role);

  const roleLabel = user
    ? user.role === "superuser"
      ? "Superuser"
      : user.role === "master_admin"
      ? "Master Admin"
      : user.role === "normal_admin"
      ? "Admin"
      : "User"
    : "User";

  const statusBadge = user?.is_active ? "badge-success" : "badge-danger";
  const statusLabel = user?.is_active ? "Active" : "Disabled";

  return (
    <header className="topbar sidebar-shell">
      <div className="sidebar-brand topbar-heading">
        <span className="brand-mark">SS</span>
        <div>
          <p className="subtitle-muted mb-1">CMS Demo Project</p>
          <h1 className="title is-4 mb-0">Dashboard overview</h1>
        </div>
        <span className="badge badge-accent">Live</span>
      </div>

      <div className="sidebar-brand topbar-controls">
        <div className="topbar-search">
          <input className="input search-input" placeholder="Search dashboard" />
        </div>

        {isAdmin && (
          <Link href="/dashboard/users" className="sidebar-link">
            <span className="menu-icon">👥</span>
            <div>
              <span className="sidebar-link-title">Invite user</span>
              <span className="menu-caption">Provision & audit</span>
            </div>
          </Link>
        )}

        <button className="sidebar-link ghost-button" type="button">
          <span className="menu-icon">↩</span>
          <div>
            <span className="sidebar-link-title">Logout</span>
            <span className="menu-caption">End session</span>
          </div>
        </button>

        {user && (
          <div className="user-summary-pill">
            <span className="user-avatar">{getInitials(user.email)}</span>
            <div>
              <p className="user-email">{user.email}</p>
              <p className="subtitle-muted">{roleLabel}</p>
            </div>
            <span className={`badge ${statusBadge}`}>{statusLabel}</span>
          </div>
        )}
      </div>
    </header>
  );
}
