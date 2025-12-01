// src/app/users/page.tsx
import { api } from "@/src/lib/api";

type User = { id: number; name: string; email: string; role: string };

async function getUsers(): Promise<User[]> {
  return api<User[]>("/users");
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Usuários</h1>
      <div className="overflow-x-auto">
        <table className="min-w-[640px] border border-gray-200">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nome</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.role}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan={4}>
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
