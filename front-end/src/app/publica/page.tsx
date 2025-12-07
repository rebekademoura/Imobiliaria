// src/app/publica/page.tsx
import Link from "next/link";
import Menu from "@/src/components/Menu";
import ImovelCard from "@/src/components/ImovelCard";
import { listarImoveis } from "@/src/lib/api";

type PageProps = {
  // no Next novo, searchParams é uma Promise
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function PublicaHome({ searchParams }: PageProps) {
  // aguardamos o searchParams
  const resolved = await searchParams;

  const finalidadeRaw = resolved["finalidade"];
  const finalidadeParam = Array.isArray(finalidadeRaw)
    ? finalidadeRaw[0]
    : finalidadeRaw;

  const finalidade =
    (finalidadeParam || "VENDA").toUpperCase() === "ALUGUEL"
      ? "ALUGUEL"
      : "VENDA";

  const imoveis = await listarImoveis(
    finalidade as "VENDA" | "ALUGUEL"
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Menu />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Imóveis para {finalidade === "VENDA" ? "compra" : "aluguel"}
            </h1>
            <p className="text-sm text-foreground/80">
              Use os botões ao lado para alternar entre imóveis para compra ou
              aluguel.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={{ pathname: "/publica", query: { finalidade: "VENDA" } }}
              className={`px-3 py-2 rounded-md border text-sm ${
                finalidade === "VENDA"
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-foreground border-foreground/20"
              }`}
            >
              Comprar
            </Link>

            <Link
              href={{ pathname: "/publica", query: { finalidade: "ALUGUEL" } }}
              className={`px-3 py-2 rounded-md border text-sm ${
                finalidade === "ALUGUEL"
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-foreground border-foreground/20"
              }`}
            >
              Alugar
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {imoveis.length === 0 && (
            <p className="text-sm text-foreground/80">
              Nenhum imóvel encontrado para esta finalidade.
            </p>
          )}

          {imoveis.map((imovel) => (
            <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </section>
      </main>
    </div>
  );
}
