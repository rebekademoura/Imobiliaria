// src/app/login/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCurrentUserClient } from "@/src/lib/auth";

type AuthResponse = {
  token: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const base = useMemo(() => process.env.NEXT_PUBLIC_API_BASE || "", []);

  function getDefaultPathForCurrentUser(): string {
    const user = getCurrentUserClient();

    if (!user?.role) return "/publica";

    const role = String(user.role).toUpperCase();

    if (role.includes("ADMIN")) return "/privado/admin";
    if (role.includes("CORRETOR")) return "/privado/corretor";

    return "/publica";
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get("redirect");

    if (redirectParam) {
      window.location.replace(redirectParam);
      return;
    }

    const destino = getDefaultPathForCurrentUser();
    window.location.replace(destino);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!base) {
      setMsg("Configuração ausente: defina NEXT_PUBLIC_API_BASE no .env.local");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!r.ok) {
        let backendMsg = "";
        try {
          const j = await r.json();
          backendMsg = typeof j === "string" ? j : j?.message || "";
        } catch {}
        throw new Error(
          backendMsg || `Credenciais inválidas (HTTP ${r.status})`
        );
      }

      const data: AuthResponse = await r.json(); // { token, user }
      if (!data?.token) {
        throw new Error("Resposta inesperada do servidor: token ausente.");
      }

      // token
      localStorage.setItem("token", data.token);

      // 👇 GUARDA TAMBÉM OS DADOS DO USUÁRIO
      if (data.user) {
        if (data.user.role) {
          localStorage.setItem("role", data.user.role);
        }
        if (data.user.name) {
          localStorage.setItem("name", data.user.name);
        }
        if (data.user.email) {
          localStorage.setItem("email", data.user.email);
        }
        if (data.user.id != null) {
          localStorage.setItem("userId", String(data.user.id));
        }
      }

      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get("redirect");
      if (redirectParam) {
        window.location.replace(redirectParam);
        return;
      }

      const destino = getDefaultPathForCurrentUser();
      window.location.replace(destino);
    } catch (err: any) {
      setMsg(err?.message || "Falha no login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6" style={{ maxWidth: 420 }}>
      <h1 className="text-2xl font-semibold mb-4">Login</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <input
            className="border p-2 w-full"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <input
            className="border p-2 w-full"
            type={showPass ? "text" : "password"}
            placeholder="Senha"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <label className="text-sm inline-flex items-center gap-2 mt-2 select-none">
            <input
              type="checkbox"
              checked={showPass}
              onChange={(e) => setShowPass(e.target.checked)}
              disabled={loading}
            />
            Mostrar senha
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="border px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>

      <p className="mt-4 text-sm">
        Não tem conta?{" "}
        <Link className="underline" href="/register">
          Cadastrar
        </Link>
      </p>
    </main>
  );
}
