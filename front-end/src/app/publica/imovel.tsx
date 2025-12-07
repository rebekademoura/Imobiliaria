// src/app/publica/imovel/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import Menu from "@/src/components/Menu";
import { buscarImovel } from "@/src/lib/api";
import type { Imovel } from "@/src/lib/api";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5551999999999";

type PageProps = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

function formatarPreco(imovel: Imovel): string {
  const preco =
    imovel.finalidade === "ALUGUEL"
      ? imovel.precoAluguel ?? imovel.precoVenda
      : imovel.precoVenda ?? imovel.precoAluguel;

  if (!preco) return "Consulte";

  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function ImovelDetalhesPage({ params }: PageProps) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }

  let imovel: Imovel;
  try {
    imovel = await buscarImovel(id);
  } catch {
    notFound();
  }

  const capa =
    imovel.fotos && imovel.fotos.length > 0
      ? imovel.fotos.find((f) => f.capa) ?? imovel.fotos[0]
      : undefined;

  const endereco = [
    `${imovel.endereco}, ${imovel.numero}`,
    imovel.bairro?.nome,
    imovel.bairro?.cidade && imovel.bairro?.estado
      ? `${imovel.bairro.cidade}/${imovel.bairro.estado}`
      : undefined,
    imovel.cep,
  ]
    .filter(Boolean)
    .join(" - ");

  const mensagemWhats = encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${imovel.titulo}" (código ${imovel.id}).`
  );
  const linkWhats = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagemWhats}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Menu />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          {capa && (
            <div className="relative w-full h-80">
              <Image
                src={capa.caminho}
                alt={imovel.titulo}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-3">
            <h1 className="text-2xl font-bold">{imovel.titulo}</h1>

            <p className="text-xl font-semibold">
              {formatarPreco(imovel)}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-semibold">Endereço:&nbsp;</span>
              {endereco}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-semibold">Finalidade:&nbsp;</span>
              {imovel.finalidade === "VENDA" ? "Venda" : "Aluguel"}
            </p>

            {imovel.tipoImovel && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Tipo:&nbsp;</span>
                {imovel.tipoImovel.nome}
              </p>
            )}

            <p className="text-sm text-gray-700 whitespace-pre-line">
              {imovel.descricao}
            </p>

            <div className="pt-4">
              <a
                href={linkWhats}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>

        {imovel.fotos && imovel.fotos.length > 1 && (
          <section className="bg-white rounded-lg shadow-sm p-4 space-y-3">
            <h2 className="font-semibold text-lg">Galeria de fotos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {imovel.fotos
                .filter((f) => !capa || f.id !== capa.id)
                .map((foto) => (
                  <div
                    key={foto.id}
                    className="relative w-full pb-[75%] overflow-hidden rounded-md"
                  >
                    <Image
                      src={foto.caminho}
                      alt={foto.nomeArquivo}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
