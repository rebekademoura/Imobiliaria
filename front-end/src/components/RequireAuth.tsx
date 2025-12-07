// src/components/RequireAuth.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUserClient, type AuthUser } from "@/src/lib/auth";

type Props = {
  children: ReactNode;
  /** se true, só ADMIN pode acessar */
  requireAdmin?: boolean;
};

export default function RequireAuth({ children, requireAdmin }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const u = getCurrentUserClient();

    // 1) não logado → manda para /login com redirect de volta
    if (!u) {
      const search = new URLSearchParams({ redirect: pathname }).toString();
      router.replace(`/login?${search}`);
      return;
    }

    // 2) logado, mas página exige ADMIN e ele não é admin
    if (requireAdmin && u.role !== "ADMIN") {
      router.replace("/publica");
      return;
    }

    // 3) ok, pode ver o conteúdo
    setUser(u);
    setChecked(true);
  }, [router, pathname, requireAdmin]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm">Verificando permissão...</p>
      </div>
    );
  }

  return <>{children}</>;
}
