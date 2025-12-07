// src/app/publica/sobre-nos/page.tsx
import Menu from "@/src/components/Menu";

export default function SobreNosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Menu />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <section className="bg-white rounded-lg shadow-sm p-6 space-y-3">
          <h1 className="text-2xl font-bold">Sobre nós</h1>
          <p className="text-sm text-gray-700">
            Aqui você coloca o texto institucional da imobiliária: história,
            missão, visão, valores, cidades e bairros onde atua, etc.
          </p>
          <p className="text-sm text-gray-700">
            Depois dá pra incluir fotos da equipe, mapa de localização e links
            para redes sociais — por enquanto deixei só o esqueleto funcional.
          </p>
        </section>
      </main>
    </div>
  );
}
