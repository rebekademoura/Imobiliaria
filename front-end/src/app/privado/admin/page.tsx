// src/app/privado/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "@/src/components/Menu";
import RequireAuth from "@/src/components/RequireAuth";
import type { Imovel } from "@/src/lib/api";
import { listarImoveis, criarUsuario } from "@/src/lib/api";

type FormUsuario = {
  name: string;
  email: string;
  password: string;
};

export default function AdminPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [salvandoUsuario, setSalvandoUsuario] = useState(false);
  const [msgUsuario, setMsgUsuario] = useState<string | null>(null);
  const [formUsuario, setFormUsuario] = useState<FormUsuario>({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    listarImoveis()
      .then(setImoveis)
      .catch((e) =>
        setErro("Erro ao carregar imóveis: " + (e as Error).message)
      );
  }, []);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  async function handleCriarCorretor(e: React.FormEvent) {
    e.preventDefault();
    setMsgUsuario(null);

    if (!token) {
      setMsgUsuario("Você precisa estar logado como administrador.");
      return;
    }

    try {
      setSalvandoUsuario(true);
      await criarUsuario(
        {
          ...formUsuario,
          role: "CORRETOR",
        },
        token
      );
      setMsgUsuario("Corretor cadastrado com sucesso.");
      setFormUsuario({ name: "", email: "", password: "" });
    } catch (error) {
      setMsgUsuario(
        "Erro ao cadastrar corretor: " + (error as Error).message
      );
    } finally {
      setSalvandoUsuario(false);
    }
  }

  return (
  <RequireAuth requireAdmin>
    <div className="min-h-screen bg-background text-foreground">
        <Menu />

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Área administrativa
              </h1>
              <p className="text-sm text-foreground/80">
                Aqui o administrador cadastra corretores, cria imóveis e
                acompanha o que está publicado no site.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/privado/imoveis/novo"
                className="rounded-md px-3 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Cadastrar novo imóvel
              </Link>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-[2fr,3fr]">
            {/* Cadastro de corretores */}
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
              <h2 className="font-semibold text-lg text-primary">
                Cadastrar corretor
              </h2>

              <form
                onSubmit={handleCriarCorretor}
                className="space-y-3 text-sm"
              >
                <div className="space-y-1">
                  <label className="block font-medium text-foreground">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={formUsuario.name}
                    onChange={(e) =>
                      setFormUsuario((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full border border-primary/20 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/60"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-foreground">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formUsuario.email}
                    onChange={(e) =>
                      setFormUsuario((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full border border-primary/20 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/60"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-foreground">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={formUsuario.password}
                    onChange={(e) =>
                      setFormUsuario((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full border border-primary/20 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/60"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={salvandoUsuario}
                  className="rounded-md px-3 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-dark disabled:opacity-60 transition-colors"
                >
                  {salvandoUsuario ? "Salvando..." : "Salvar corretor"}
                </button>

                {msgUsuario && (
                  <p className="text-xs text-foreground/80 mt-2">
                    {msgUsuario}
                  </p>
                )}
              </form>
            </div>

            {/* Lista rápida de imóveis */}
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
              <h2 className="font-semibold text-lg text-primary">
                Imóveis cadastrados
              </h2>

              {erro && <p className="text-xs text-red-500">{erro}</p>}

              <div className="max-h-80 overflow-auto text-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-primary/10 text-left text-xs text-foreground/60">
                      <th className="py-1 pr-2">ID</th>
                      <th className="py-1 pr-2">Título</th>
                      <th className="py-1 pr-2">Finalidade</th>
                      <th className="py-1 pr-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {imoveis.map((imovel) => (
                      <tr
                        key={imovel.id}
                        className="border-b last:border-0 border-foreground/5"
                      >
                        <td className="py-1 pr-2 text-xs text-foreground/70">
                          {imovel.id}
                        </td>
                        <td className="py-1 pr-2">{imovel.titulo}</td>
                        <td className="py-1 pr-2 text-xs text-foreground/80">
                          {imovel.finalidade}
                        </td>
                        <td className="py-1 pr-2 text-xs text-foreground/80">
                          {imovel.status}
                        </td>
                      </tr>
                    ))}

                    {imoveis.length === 0 && !erro && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-2 text-xs text-foreground/70"
                        >
                          Nenhum imóvel cadastrado ainda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-foreground/70">
                Depois podemos criar telas específicas para editar/excluir
                imóveis; aqui é só um painel rápido.
              </p>
            </div>
          </section>
        </main>
      </div>
    </RequireAuth>
  );
}
