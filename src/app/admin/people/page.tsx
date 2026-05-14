import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DeleteButton } from '@/app/admin/_components/delete-button';

async function deletePerson(id: string) {
  'use server';
  await prisma.person.delete({ where: { id } });
  redirect('/admin/people');
}

export default async function AdminPeoplePage() {
  const people = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    include: { credits: true },
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">People</h2>
          <p className="text-sm text-muted-foreground">
            Manage directors and actors.
          </p>
        </div>
        <Link
          href="/admin/people/new"
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          New Person
        </Link>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Credits</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id} className="border-b last:border-0">
                <td className="px-4 py-3">{person.name}</td>
                <td className="px-4 py-3">{person.credits.length}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/people/${person.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <form action={deletePerson.bind(null, person.id)}>
                    <DeleteButton label="person" />
                  </form>
                  </div>
                </td>
              </tr>
            ))}
            {people.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  No people yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}