// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Front + Next.js</h1>
      <ul className="list-disc pl-6">
        <li><Link className="underline" href="/users">Lista de usuários</Link></li>
      </ul>
    </main>
  );
}
