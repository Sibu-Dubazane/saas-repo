import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SaaS Starter",
  description: "FastAPI + Next.js + Postgres",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Bulma via CDN (no npm CSS) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
          integrity="sha384-G0JmKQXqtGwaZQwxJi1qY5q+5CkyDA5eKnG6YkX1Gz6my9haOZOQ1Coxtk4i9j9V"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Navbar />
        <main className="app-shell">{children}</main>
      </body>
    </html>
  );
}
