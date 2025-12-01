"use client";

import { useState } from "react";
import Link from "next/link";

type Role = "ADMIN" | "USER"; // ajuste conforme seu back aceita

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const base = process.env.NEXT_PUBLIC_API_BASE as string;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      // seu back deve aceitar POST /users com {name,email,role,password}
      const r = await fetch(`${base}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, password }),
      });

      if (!r.ok) {
        const j = await r.json().catch(() => null);
        throw new Error(j?.message || `Falha no cadastro (${r.status})`);
      }

      setMsg("Cadastro realizado! Você já pode fazer login.");
      // redireciona pro login
      window.location.href = "/login";
    } catch (err: any) {
      setMsg(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6" style={{ maxWidth: 480 }}>
      <h1 className="text-2xl font-semibold mb-4">Cadastro</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          className="border p-2 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <input
          className="border p-2 w-full"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={loading} className="border px-4 py-2">
          {loading ? "Salvando..." : "Cadastrar"}
        </button>

        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>

      <p className="mt-4 text-sm">
        Já tem conta? <Link className="underline" href="/login">Entrar</Link>
      </p>
    </main>
  );
}
