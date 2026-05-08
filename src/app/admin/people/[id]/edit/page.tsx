import { UpdateButton } from '@/app/admin/_components/update-button';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';

async function updatePerson(id: string, formData: FormData) {
  'use server';

  const name = formData.get('name') as string;
  const bio = formData.get('bio') as string;

  await prisma.person.update({
    where: { id },
    data: { name, bio: bio || null },
  });

  redirect('/admin/people');
}

export default async function AdminEditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const person = await prisma.person.findUnique({
    where: { id },
  });

  if (!person) notFound();

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Edit Person</h2>

      <form action={updatePerson.bind(null, id)} className="space-y-3">
        <div>
          <label className="text-sm">Name</label>
          <input
            name="name"
            required
            defaultValue={person.name}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Bio (optional)</label>
          <textarea
            name="bio"
            rows={4}
            defaultValue={person.bio ?? ''}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <UpdateButton label="person" />
        </div>
      </form>

   
    </section>
  );
}