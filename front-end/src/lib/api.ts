// src/lib/api.ts

// =======================
// Tipos compartilhados
// =======================

export type FinalidadeImovel = "VENDA" | "ALUGUEL" | string;
export type StatusImovel = "ATIVO" | "INATIVO" | "ALUGADO" | "VENDIDO" | string;

export type Imovel = {
  id: number;
  titulo: string;
  finalidade: FinalidadeImovel;
  status: StatusImovel;
  preco?: number;
  endereco?: string;
  cidade?: string;
  bairro?: string;
  imagemUrl?: string;
  descricao?: string;
};

export type Usuario = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CORRETOR" | string;
};

export type NovoUsuario = {
  name: string;
  email: string;
  password: string;
  role: string;
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

  // Só tenta pegar token no cliente e quando withAuth = true
  const token =
    withAuth && typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (withAuth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // evita // na URL
  const url = base.replace(/\/$/, "") + path;

  // Logzinho para debug (pode remover depois)
  console.log("Chamando API:", url, "auth?", withAuth);

  const res = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }

  return res.json();
}

// =======================
// Wrappers públicos/privados
// =======================

/**
 * Para rotas públicas (NÃO envia Authorization).
 * Ex.: listar imóveis para a home /publica.
 */
export async function apiPublic<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  return baseApi<T>(path, init, false);
}

/**
 * Para rotas que exigem autenticação (envia Authorization se houver token).
 * Ex.: área do admin, corretor, criação de imóveis, etc.
 */
export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  return baseApi<T>(path, init, true);
}

// =======================
// Imóveis
// =======================

/**
 * Lista imóveis para a área pública.
 * Se você tiver filtro de finalidade no back, ele será passado como query param.
 * Caso o back ignore o parâmetro, não tem problema.
 */
export async function listarImoveis(
  finalidade?: "VENDA" | "ALUGUEL"
): Promise<Imovel[]> {
  const params = finalidade ? `?finalidade=${finalidade}` : "";
  return apiPublic<Imovel[]>(`/imoveis${params}`);
}

/**
 * Busca um imóvel específico por ID (público, usado na página de detalhes).
 */
export async function buscarImovel(id: number | string): Promise<Imovel> {
  return apiPublic<Imovel>(`/imoveis/${id}`);
}

/**
 * Cria um imóvel (área autenticada: admin/corretor).
 * Exemplo de uso futuro na tela de cadastro de imóveis.
 */
export async function criarImovel(dados: Partial<Imovel>): Promise<Imovel> {
  return api<Imovel>("/imoveis", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

/**
 * Atualiza um imóvel.
 */
export async function atualizarImovel(
  id: number | string,
  dados: Partial<Imovel>
): Promise<void> {
  await api<void>(`/imoveis/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

/**
 * Exclui um imóvel.
 */
export async function deletarImovel(id: number | string): Promise<void> {
  await api<void>(`/imoveis/${id}`, {
    method: "DELETE",
  });
}

// =======================
// Usuários
// =======================

/**
 * Cria usuário (ADMIN criando CORRETOR, por exemplo).
 * Compatível com o uso em AdminPage:
 *
 * await criarUsuario({
 *   ...formUsuario,
 *   role: "CORRETOR"
 * }, token);
 *
 * O segundo parâmetro (tokenOverride) é opcional e atualmente é ignorado,
 * pois o token já é lido de localStorage pela função api().
 */
export async function criarUsuario(
  dados: NovoUsuario,
  tokenOverride?: string
): Promise<Usuario> {
  // Se quiser usar o tokenOverride manualmente no futuro, dá pra adaptar aqui.
  return api<Usuario>("/users", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

/**
 * Lista usuários (se o back permitir e for útil pra algum painel).
 */
export async function listarUsuarios(): Promise<Usuario[]> {
  return api<Usuario[]>("/users");
}
