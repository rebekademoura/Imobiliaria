// src/lib/auth.ts

export type UserRole = "ADMIN" | "CORRETOR" | string;

export type AuthUser = {
  id?: number | string;
  email?: string;
  name?: string;
  role?: UserRole;
};

export function getCurrentUserClient(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  const role = localStorage.getItem("role") ?? undefined;
  const email = localStorage.getItem("email") ?? undefined;
  const name = localStorage.getItem("name") ?? undefined;
  const id = localStorage.getItem("userId") ?? undefined;

  return {
    id,
    email,
    name,
    role,
  };
}

export function isAuthenticatedClient(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export function isAdminClient(): boolean {
  const user = getCurrentUserClient();
  if (!user?.role) return false;

  const r = String(user.role).toUpperCase();
  return r.includes("ADMIN");
}
