// src/app/privado/corretor/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "@/src/components/Menu";
import type { Imovel } from "@/src/lib/api";
import { listarImoveis } from "@/src/lib/api";
import RequireAuth from "@/src/components/RequireAuth";


export default function CorretorPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    if (!token) return;

    // Depois você pode trocar aqui por um endpoint tipo /imoveis/meus
    listarImoveis()
      .then(setImoveis)
      .catch((e) =>
        setErro("Erro ao carregar imóveis: " + (e as Error).message)
      );
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-3">
          <h1 className="text-2xl font-bold">Área do corretor</h1>
          <p className="text-sm text-gray-700">
            Você precisa estar logado como corretor para acessar esta página.
          </p>
          <Link
            href="/login"
            className="inline-block mt-3 border rounded-md px-3 py-2 text-sm hover:bg-gray-100"
          >
            Ir para login
          </Link>
        </main>
      </div>
    );
  }

    return (
  <RequireAuth>
        <div className="min-h-screen bg-gray-50">
      <Menu />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Meus imóveis</h1>
            <p className="text-sm text-gray-600">
              Aqui o corretor gerencia apenas os imóveis que ele cadastrou.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/privado/imoveis/novo"
              className="rounded-md px-3 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-black"
            >
              Cadastrar novo imóvel
            </Link>
          </div>
        </header>

        <section className="bg-white rounded-lg shadow-sm p-4 space-y-3">
          {erro && <p className="text-xs text-red-600">{erro}</p>}

          <div className="max-h-[26rem] overflow-auto text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="py-1 pr-2">ID</th>
                  <th className="py-1 pr-2">Título</th>
                  <th className="py-1 pr-2">Finalidade</th>
                  <th className="py-1 pr-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {imoveis.map((imovel) => (
                  <tr key={imovel.id} className="border-b last:border-0">
                    <td className="py-1 pr-2 text-xs">{imovel.id}</td>
                    <td className="py-1 pr-2">{imovel.titulo}</td>
                    <td className="py-1 pr-2 text-xs">
                      {imovel.finalidade}
                    </td>
                    <td className="py-1 pr-2 text-xs">{imovel.status}</td>
                  </tr>
                ))}

                {imoveis.length === 0 && !erro && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-2 text-xs text-gray-600"
                    >
                      Nenhum imóvel encontrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500">
            Depois dá pra filtrar realmente só pelos imóveis do corretor logado
            (endpoint /imoveis/meus no back).
          </p>
        </section>
      </main>
    </div>
  </RequireAuth>
);

}
