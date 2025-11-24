import axios from "axios";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (isRecord(data)) {
      const detail = data.detail;

      if (typeof detail === "string") {
        return detail;
      }

      if (Array.isArray(detail)) {
        const messages = detail
          .map((item) => {
            if (typeof item === "string") {
              return item;
            }
            if (isRecord(item) && typeof item.msg === "string") {
              return item.msg;
            }
            return null;
          })
          .filter(Boolean) as string[];

        if (messages.length) {
          return messages.join(" ");
        }
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

// Axios instance with base URL from NEXT_PUBLIC_API_URL
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


// Normal user profile
export async function getCurrentUser() {
  const res = await api.get("/users/me");
  return res.data;
}

// Admin-only list of all users
export async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}

const userApi = {
  getCurrentUser,
  getUsers,
};

export default userApi;