// src/app/area/page.tsx
"use client";
import { useEffect, useState } from "react";

type Me = { id:number; name:string; email:string; role:string };

export default function AreaPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE!;
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }

    fetch(`${base}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Sessão inválida (${r.status})`);
        setMe(await r.json());
      })
      .catch((e) => {
        setErr(e.message);
        // sem token valido -> volta pro login
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  if (!me) return <main className="p-6">Carregando...</main>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Área Privada</h1>
      <p className="mb-4">Olá, <b>{me.name}</b> ({me.email}) — {me.role}</p>
      <button
        className="border px-3 py-1"
        onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
      >
        Sair
      </button>
    </main>
  );
}
