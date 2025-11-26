"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/api/v1/users/me")
      .then(() => {
        if (!cancelled) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    try {
      await api.post("/api/v1/auth/logout");
    } finally {
      window.location.href = "/";
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`topbar glass-toolbar landing-topbar ${isMenuOpen ? "menu-open" : ""}`}>
      <div className="landing-topbar-inner">
        <div className="topbar-heading landing-brand">
          <Link
            href="/"
            className="brand-pill"
            aria-label="CMS Demo Project home"
            onClick={closeMenu}
          >
            <span className="brand-mark">SS</span>
            <div className="landing-brand-copy">
              <p className="subtitle-muted">CMS Demo Project</p>
              <p className="landing-brand-title">THIS IS A DEMO PROJECT</p>
            </div>
          </Link>
          <button
            className={`ghost-button mobile-toggle ${isMenuOpen ? "is-active" : ""}`}
            aria-label="Toggle navigation menu"
            aria-controls="landingNav"
            aria-expanded={isMenuOpen}
            type="button"
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav
          id="landingNav"
          className={`topbar-controls landing-nav-links ${isMenuOpen ? "is-active" : ""}`}
          aria-label="Primary navigation"
        >
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="sidebar-link" onClick={closeMenu}>
                <span className="menu-icon">📊</span>
                <div>
                  <span className="sidebar-link-title">Dashboard</span>
                  <span className="menu-caption">Open console</span>
                </div>
              </Link>
              <button
                className="sidebar-link ghost-button"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  void handleLogout();
                }}
              >
                <span className="menu-icon">↩</span>
                <div>
                  <span className="sidebar-link-title">Logout</span>
                  <span className="menu-caption">End session</span>
                </div>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="ghost-button pill-link" onClick={closeMenu}>
                Login
              </Link>
              <Link href="/signup" className="cta-link" onClick={closeMenu}>
                Start for free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
