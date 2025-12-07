// src/components/ImovelCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { Imovel } from "@/src/lib/api";

type Props = {
  imovel: Imovel;
};

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

export default function ImovelCard({ imovel }: Props) {
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
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <article className="border rounded-lg overflow-hidden shadow-sm flex flex-col bg-white">
      {capa && (
        <div className="relative w-full h-52">
          <Image
            src={capa.caminho}
            alt={imovel.titulo}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-lg">{imovel.titulo}</h3>

        <p className="text-sm text-gray-600">{imovel.descricao}</p>

        <p className="font-bold mt-1">{formatarPreco(imovel)}</p>

        <p className="text-xs text-gray-500">{endereco}</p>

        <Link
          href={`/publica/imovel/${imovel.id}`}
          className="mt-3 inline-block text-center border rounded-md px-3 py-2 text-sm hover:bg-gray-100"
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
