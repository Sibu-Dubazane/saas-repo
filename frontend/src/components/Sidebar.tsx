"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

function Sidebar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api
      .get("/users/me")
      .then((r) => setUser(r.data))
      .catch(() => {});
  }, []);

  const isAdmin =
    user && ["superuser", "master_admin", "normal_admin"].includes(user.role);

  return (
    <aside className="sidebar-shell">
      <div className="sidebar-brand">
        <span className="brand-mark">SS</span>
        <div>
          <p className="subtitle-muted mb-1">CMS Demo Project</p>
          <h3 className="sidebar-brand-title">Control hub</h3>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <p className="menu-label">General</p>
          <ul className="menu-list">
            <li>
              <Link href="/dashboard" className="sidebar-link">
                <span className="menu-icon">🏠</span>
                <div>
                  <span className="sidebar-link-title">Dashboard</span>
                  <span className="menu-caption">Overview & stats</span>
                </div>
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link href="/dashboard/users" className="sidebar-link">
                  <span className="menu-icon">👥</span>
                  <div>
                    <span className="sidebar-link-title">Users</span>
                    <span className="menu-caption">Provision & audit</span>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <p className="menu-label">Account</p>
          <ul className="menu-list">
            <li>
              <Link href="/dashboard/profile" className="sidebar-link">
                <span className="menu-icon">👤</span>
                <div>
                  <span className="sidebar-link-title">My Profile</span>
                  <span className="menu-caption">Identity & access</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/settings" className="sidebar-link">
                <span className="menu-icon">⚙️</span>
                <div>
                  <span className="sidebar-link-title">Settings</span>
                  <span className="menu-caption">Preferences</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
