// src/components/RequireAuth.tsx
"use client";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
    else setOk(true);
  }, []);
  if (!ok) return null; // ou um spinner
  return <>{children}</>;
}
