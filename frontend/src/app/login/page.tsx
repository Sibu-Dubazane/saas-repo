"use client";

import { FormEvent, useState } from "react";
import { api, extractErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password });
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="auth-shell">
          <div className="auth-hero">
            <span className="badge-pill">Fast · Focused · Secure</span>
            <h1>Welcome back 👋</h1>
            <p>
            Everything you love about the CMS Demo Project.
            </p>
          </div>
          <div className="auth-panel">
            <div className="panel-heading">
              <div>
                <p className="subtitle-muted">Access portal</p>
                <h2 className="title is-4 mb-0">Login</h2>
              </div>
              <span className="badge badge-soft">Private</span>
            </div>

            <form onSubmit={onSubmit}>
              <div className="field">
                <label className="label" htmlFor="login-email">
                  Email
                </label>
                <div className="control">
                  <input
                    id="login-email"
                    className="glass-input"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="login-password">
                  Password
                </label>
                <div className="control">
                  <input
                    id="login-password"
                    className="glass-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button
                    className={`button is-link is-fullwidth ${loading ? "is-loading" : ""}`}
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>

            {msg && (
              <p className="mt-3 has-text-danger" role="alert" aria-live="assertive">
                {msg}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
