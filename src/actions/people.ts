
'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
// [NEW 2026-05-17] Added Zod validation for people server actions.
import { z } from 'zod';

// [NEW] Zod schema to validate person form data before DB operations.
const personSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  bio: z.string().optional().default(''),
});

export async function createPerson(formData: FormData) {
  const raw = {
    name: formData.get('name'),
    bio: formData.get('bio') || '',
  };

  // [NEW] Zod validation — rejects empty names or invalid data.
  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Validation errors:', parsed.error.flatten());
    throw new Error('Invalid person data');
  }

  // [NEW] Use validated data only.
  await prisma.person.create({
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
    },
  });

  revalidatePath('/admin/people');
  redirect('/admin/people');
}

export async function updatePerson(id: string, formData: FormData) {
  const raw = {
    name: formData.get('name'),
    bio: formData.get('bio') || '',
  };

  // [NEW] Zod validation — same schema used for create and update.
  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Validation errors:', parsed.error.flatten());
    throw new Error('Invalid person data');
  }

  // [NEW] Use validated data only.
  await prisma.person.update({
    where: { id },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
    },
  });

  revalidatePath('/admin/people');
  redirect('/admin/people');
}

export async function deletePerson(id: string) {
  await prisma.person.delete({ where: { id } });
  revalidatePath('/admin/people');
  redirect('/admin/people');
}
