// src/components/Menu.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserClient, type AuthUser } from "@/src/lib/auth";

export default function Menu() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const u = getCurrentUserClient();
    setUser(u);
  }, []);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setUser(null);
    router.replace("/publica");
  }

  function handlePerfil() {
    if (!user) {
      router.push("/login");
      return;
    }

    const rawRole = user.role ? String(user.role).toUpperCase() : "";

    console.log("ROLE do usuário (normalizado):", rawRole);

    if (rawRole.includes("ADMIN")) {
      router.push("/privado/admin");
      return;
    }

    if (rawRole.includes("CORRETOR")) {
      router.push("/privado/corretor");
      return;
    }

    router.push("/publica");
  }

  const isLogged = !!user;

  return (
    <header className="border-b bg-background text-primary">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        <Link href="/publica" className="font-bold text-lg text-primary">
          Imobiliária
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/publica" className="hover:text-primary-dark">
            Início
          </Link>
          <Link
            href="/publica?finalidade=VENDA"
            className="hover:text-primary-dark"
          >
            Comprar
          </Link>
          <Link
            href="/publica?finalidade=ALUGUEL"
            className="hover:text-primary-dark"
          >
            Alugar
          </Link>
          <Link
            href="/publica/sobre-nos"
            className="hover:text-primary-dark"
          >
            Sobre nós
          </Link>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {!isLogged && (
            <>
              <Link href="/login" className="border rounded-md px-3 py-1 bg-primary text-white hover:bg-primary-dark">
                Entrar
              </Link>
            </>
          )}

          {isLogged && (
            <>
              {user?.name && (
                <span className="text-foreground/80 hidden sm:inline">
                  Olá, <span className="font-semibold">{user.name}</span>
                </span>
              )}

              <button
                type="button"
                onClick={handlePerfil}
                className="hover:text-primary-dark"
              >
                Perfil
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="border rounded-md px-3 py-1 hover:bg-primary/5"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
