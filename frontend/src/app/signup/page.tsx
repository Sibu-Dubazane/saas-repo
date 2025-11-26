"use client";

import { FormEvent, useState } from "react";
import { api, extractErrorMessage } from "@/lib/api";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    if (password !== passwordConfirm) {
      setMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/v1/auth/signup", {
        email,
        password,
        password_confirm: passwordConfirm,
      });

      setMsg("Account created. You can login now.");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
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
            <span className="badge-pill">Start fresh</span>
            <h1>Create your account ✨</h1>
            <p>
              Sign up once, enjoy my demo project
            </p>
          </div>

          <div className="auth-panel">
            <div className="panel-heading">
              <div>
                <p className="subtitle-muted">CMS access</p>
                <h2 className="title is-4 mb-0">Sign up</h2>
              </div>
              <span className="badge badge-soft">New</span>
            </div>

            <form onSubmit={onSubmit}>
              <div className="field">
                <label className="label" htmlFor="signup-email">
                  Email
                </label>
                <div className="control">
                  <input
                    id="signup-email"
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
                <label className="label" htmlFor="signup-password">
                  Password
                </label>
                <div className="control">
                  <input
                    id="signup-password"
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
                <label className="label" htmlFor="signup-password-confirm">
                  Confirm Password
                </label>
                <div className="control">
                  <input
                    id="signup-password-confirm"
                    className="glass-input"
                    type="password"
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field mt-3">
                <div className="control">
                  <button
                    className={`button is-link is-fullwidth ${loading ? "is-loading" : ""}`}
                    type="submit"
                  >
                    Create account
                  </button>
                </div>
              </div>
            </form>

            {msg && (
              <p className={`mt-3 ${msg.includes("created") ? "has-text-success" : "has-text-danger"}`}>
                {msg}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
