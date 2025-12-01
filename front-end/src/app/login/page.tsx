"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Base da API (ex.: http://localhost:8080). Configure em .env.local
  const base = useMemo(() => process.env.NEXT_PUBLIC_API_BASE || "", []);

  // Se já tiver token salvo, manda direto para a área (qualquer rota passada em ?redirect)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const params = new URLSearchParams(window.location.search);
      window.location.replace(params.get("redirect") || "/area");
    }
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
        // tenta extrair mensagem do back
        let backendMsg = "";
        try {
          const j = await r.json();
          backendMsg = typeof j === "string" ? j : j?.message || "";
        } catch {}
        throw new Error(backendMsg || `Credenciais inválidas (HTTP ${r.status})`);
      }

      const data = await r.json(); // esperado: { token: "..." }
      if (!data?.token) {
        throw new Error("Resposta inesperada do servidor: token ausente.");
      }

      localStorage.setItem("token", data.token);

      const params = new URLSearchParams(window.location.search);
      window.location.replace(params.get("redirect") || "/area");
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
