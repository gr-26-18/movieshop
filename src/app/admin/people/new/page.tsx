import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { UpdateButton } from '@/app/admin/_components/update-button';

async function createPerson(formData: FormData) {
  'use server';

  const name = formData.get('name') as string;
  const bio = formData.get('bio') as string;

  await prisma.person.create({
    data: { name, bio: bio || null },
  });

  redirect('/admin/people');
}

export default function AdminNewPersonPage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add Person</h2>
        <p className="text-sm text-muted-foreground">
          Add a new director or actor.
        </p>
      </div>

      <form action={createPerson} className="space-y-3">
        <div>
          <label className="text-sm">Name</label>
          <input
            name="name"
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">Bio (optional)</label>
          <textarea
            name="bio"
            rows={4}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <UpdateButton label="new person" buttonText="Add Person" />
      </form>
    </section>
  );
}