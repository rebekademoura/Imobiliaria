// src/lib/api.ts

// =======================
// Tipos compartilhados
// =======================

export type FinalidadeImovel = "VENDA" | "ALUGUEL" | string;
export type StatusImovel =
  | "ATIVO"
  | "INATIVO"
  | "ALUGADO"
  | "VENDIDO"
  | string;

export type Imovel = {
  id: number;
  titulo: string;
  finalidade: FinalidadeImovel;
  status: StatusImovel;

  descricao?: string;
  destaque?: boolean;

  preco?: number; // uso genérico na tela pública
  precoVenda?: number;
  precoAluguel?: number;

  endereco?: string;
  numero?: string;
  cep?: string;
  complemento?: string;
  cidade?: string;
  bairro?: string;

  bairroId?: number;
  tipoImovelId?: number;
};


export type NovoUsuario = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type Usuario = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type Bairro = {
  id: number;
  nome: string;
  cidade?: string;
  estado?: string;
};

export type TipoImovel = {
  id: number;
  nome: string;
  descricao?: string;
};

// =======================
// Função base da API
// =======================

async function baseApi<T>(
  path: string,
  init: RequestInit = {},
  withAuth: boolean
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE;

  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE não definido. " +
        "Configure no .env.local, ex.: NEXT_PUBLIC_API_BASE=http://localhost:8080"
    );
  }

  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");

  const token =
    withAuth && typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (withAuth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = base.replace(/\/$/, "") + path;

  console.log("Chamando API:", url, "auth?", withAuth);

  const res = await fetch(url, {
    ...init,
    headers,
    cache: init.cache ?? "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }

  // Pode haver respostas SEM corpo (ex.: 201/204)
  const raw = await res.text().catch(() => "");
  if (!raw) {
    // @ts-expect-error – em alguns casos T pode ser void/null
    return undefined;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    // Se não for JSON válido, devolve erro mais amigável
    throw new Error("Resposta da API não é um JSON válido.");
  }
}

// =======================
// Wrappers públicos/privados
// =======================

/** Para rotas públicas (NÃO envia Authorization) */
export async function apiPublic<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  return baseApi<T>(path, init, false);
}

/** Para rotas autenticadas (envia Authorization se houver token) */
export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  return baseApi<T>(path, init, true);
}

// =======================
// Imóveis
// =======================

export async function listarImoveis(
  finalidade?: "VENDA" | "ALUGUEL"
): Promise<Imovel[]> {
  const params = finalidade ? `?finalidade=${finalidade}` : "";
  return apiPublic<Imovel[]>(`/imoveis${params}`);
}

export async function buscarImovel(id: number | string): Promise<Imovel> {
  return apiPublic<Imovel>(`/imoveis/${id}`);
}

/**
 * Cria um novo imóvel.
 * Usa fetch direto sem esperar JSON, porque o back hoje devolve 201 sem corpo.
 */
export async function criarImovel(dados: Partial<Imovel>): Promise<void> {
  const base = process.env.NEXT_PUBLIC_API_BASE;

  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE não definido. " +
        "Configure no .env.local, ex.: NEXT_PUBLIC_API_BASE=http://localhost:8080"
    );
  }

  const url = base.replace(/\/$/, "") + "/imoveis";

  console.log("Chamando API (criarImovel):", url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // se quiser enviar token mesmo com endpoint público:
      // ...(typeof window !== "undefined" && localStorage.getItem("token")
      //   ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
      //   : {}),
    },
    body: JSON.stringify(dados),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }

  // sem res.json(): o back não devolve corpo nesse endpoint
  return;
}

export async function atualizarImovel(
  id: number | string,
  dados: Partial<Imovel>
): Promise<void> {
  await api<void>(`/imoveis/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export async function deletarImovel(id: number | string): Promise<void> {
  await api<void>(`/imoveis/${id}`, {
    method: "DELETE",
  });
}

// =======================
// Bairros e Tipos de Imóvel
// =======================

export async function listarBairros(): Promise<Bairro[]> {
  return apiPublic<Bairro[]>("/bairros");
}

export async function listarTiposImoveis(): Promise<TipoImovel[]> {
  // ajuste o path se no back estiver diferente
  return apiPublic<TipoImovel[]>("/tiposImoveis");
}

// =======================
// Usuários
// =======================

export async function criarUsuario(dados: NovoUsuario): Promise<Usuario> {
  return apiPublic<Usuario>("/users", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export async function listarUsuarios(): Promise<Usuario[]> {
  return api<Usuario[]>("/users");
}
