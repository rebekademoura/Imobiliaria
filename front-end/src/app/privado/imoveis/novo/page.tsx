// src/app/privado/imoveis/novo/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import Menu from "@/src/components/Menu";
import {
  Bairro,
  TipoImovel,
  listarBairros,
  listarTiposImoveis,
  criarImovel,
} from "@/src/lib/api";

type FormState = {
  titulo: string;
  descricao: string;
  finalidade: "VENDA" | "ALUGUEL";
  precoVenda: string;
  precoAluguel: string;
  endereco: string;
  numero: string;
  cep: string;
  complemento: string;
  status: string;
  destaque: boolean;
  dormitorios: string;
  banheiros: string;
  garagem: string;
  areaConstruida: string;
  areaTotal: string;
  bairroId: string;
  tipoImovelId: string;
};

export default function NovoImovelPage() {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [tipos, setTipos] = useState<TipoImovel[]>([]);
  const [form, setForm] = useState<FormState>({
    titulo: "",
    descricao: "",
    finalidade: "VENDA",
    precoVenda: "",
    precoAluguel: "",
    endereco: "",
    numero: "",
    cep: "",
    complemento: "",
    status: "ATIVO",
    destaque: false,
    dormitorios: "",
    banheiros: "",
    garagem: "",
    areaConstruida: "",
    areaTotal: "",
    bairroId: "",
    tipoImovelId: "",
  });
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarBairros()
      .then(setBairros)
      .catch(() =>
        setMensagem(
          "Não foi possível carregar a lista de bairros. Verifique a API /bairros."
        )
      );

    listarTiposImoveis()
      .then(setTipos)
      .catch(() =>
        setMensagem(
          "Não foi possível carregar a lista de tipos de imóvel. Verifique a API /tipos-imoveis."
        )
      );
  }, []);

  function handleChange(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      setMensagem("Você precisa estar logado para cadastrar imóveis.");
      return;
    }

    try {
      setSalvando(true);

      const dormitorios = form.dormitorios ? Number(form.dormitorios) : 0;
      const banheiros = form.banheiros ? Number(form.banheiros) : 0;
      const garagem = form.garagem ? Number(form.garagem) : 0;

      const precoVenda = form.precoVenda
        ? Number(form.precoVenda.replace(",", "."))
        : null;
      const precoAluguel = form.precoAluguel
        ? Number(form.precoAluguel.replace(",", "."))
        : null;
      const areaConstruida = form.areaConstruida
        ? Number(form.areaConstruida.replace(",", "."))
        : null;
      const areaTotal = form.areaTotal
        ? Number(form.areaTotal.replace(",", "."))
        : null;

      await criarImovel(
        {
          titulo: form.titulo,
          descricao: form.descricao,
          finalidade: form.finalidade,
          precoVenda,
          precoAluguel,
          endereco: form.endereco,
          numero: form.numero,
          cep: form.cep,
          complemento: form.complemento || undefined,
          status: form.status,
          destaque: form.destaque,
          dormitorios,
          banheiros,
          garagem,
          areaConstruida,
          areaTotal,
          bairroId: Number(form.bairroId),
          tipoImovelId: Number(form.tipoImovelId),
        },
        token
      );

      setMensagem("Imóvel cadastrado com sucesso.");
      setForm((prev) => ({
        ...prev,
        titulo: "",
        descricao: "",
        precoVenda: "",
        precoAluguel: "",
        endereco: "",
        numero: "",
        cep: "",
        complemento: "",
        dormitorios: "",
        banheiros: "",
        garagem: "",
        areaConstruida: "",
        areaTotal: "",
        bairroId: "",
        tipoImovelId: "",
      }));
    } catch (error) {
      setMensagem(
        "Erro ao salvar imóvel: " + (error as Error).message
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Menu />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">Cadastrar imóvel</h1>
          <p className="text-sm text-gray-600">
            Formulário com as principais informações de um imóvel.
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 text-sm"
          >
            <div className="md:col-span-2 space-y-1">
              <label className="font-medium">Título</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) =>
                  handleChange("titulo", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-medium">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) =>
                  handleChange("descricao", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1 min-h-[80px]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium">Finalidade</label>
              <select
                value={form.finalidade}
                onChange={(e) =>
                  handleChange(
                    "finalidade",
                    e.target.value as "VENDA" | "ALUGUEL"
                  )
                }
                className="w-full border rounded-md px-2 py-1"
              >
                <option value="VENDA">Venda</option>
                <option value="ALUGUEL">Aluguel</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium">Status</label>
              <input
                type="text"
                value={form.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium">Preço de venda (R$)</label>
              <input
                type="text"
                value={form.precoVenda}
                onChange={(e) =>
                  handleChange("precoVenda", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium">Preço de aluguel (R$)</label>
              <input
                type="text"
                value={form.precoAluguel}
                onChange={(e) =>
                  handleChange("precoAluguel", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium">Dormitórios</label>
              <input
                type="number"
                min={0}
                value={form.dormitorios}
                onChange={(e) =>
                  handleChange("dormitorios", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium">Banheiros</label>
              <input
                type="number"
                min={0}
                value={form.banheiros}
                onChange={(e) =>
                  handleChange("banheiros", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium">Vagas de garagem</label>
              <input
                type="number"
                min={0}
                value={form.garagem}
                onChange={(e) =>
                  handleChange("garagem", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium">Área construída (m²)</label>
              <input
                type="text"
                value={form.areaConstruida}
                onChange={(e) =>
                  handleChange("areaConstruida", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium">Área total (m²)</label>
              <input
                type="text"
                value={form.areaTotal}
                onChange={(e) =>
                  handleChange("areaTotal", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </div>

            <div className="md:col-span-2 grid md:grid-cols-[2fr,1fr] gap-4">
              <div className="space-y-1">
                <label className="font-medium">Endereço</label>
                <input
                  type="text"
                  value={form.endereco}
                  onChange={(e) =>
                    handleChange("endereco", e.target.value)
                  }
                  className="w-full border rounded-md px-2 py-1"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium">Número</label>
                <input
                  type="text"
                  value={form.numero}
                  onChange={(e) =>
                    handleChange("numero", e.target.value)
                  }
                  className="w-full border rounded-md px-2 py-1"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium">CEP</label>
              <input
                type="text"
                value={form.cep}
                onChange={(e) =>
                  handleChange("cep", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium">Complemento</label>
              <input
                type="text"
                value={form.complemento}
                onChange={(e) =>
                  handleChange("complemento", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium">Bairro</label>
              <select
                value={form.bairroId}
                onChange={(e) =>
                  handleChange("bairroId", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
                required
              >
                <option value="">Selecione...</option>
                {bairros.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome} - {b.cidade}/{b.estado}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium">Tipo de imóvel</label>
              <select
                value={form.tipoImovelId}
                onChange={(e) =>
                  handleChange("tipoImovelId", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1"
                required
              >
                <option value="">Selecione...</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="destaque"
                type="checkbox"
                checked={form.destaque}
                onChange={(e) =>
                  handleChange("destaque", e.target.checked)
                }
                className="h-4 w-4"
              />
              <label htmlFor="destaque" className="text-sm">
                Imóvel em destaque
              </label>
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-3 pt-2">
              <button
                type="submit"
                disabled={salvando}
                className="rounded-md px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-black disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar imóvel"}
              </button>

              {mensagem && (
                <p className="text-xs text-gray-700">{mensagem}</p>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
