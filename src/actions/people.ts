
'use server';

import { prisma } from '@/lib/prisma';
import { isAdminUser } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const personSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  bio: z.string().optional().default(''),
});

export async function createPerson(formData: FormData) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error('Unauthorized');

  const raw = {
    name: formData.get('name'),
    bio: formData.get('bio') || '',
  };

  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Validation errors:', parsed.error.flatten());
    throw new Error('Invalid person data');
  }

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
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error('Unauthorized');

  const raw = {
    name: formData.get('name'),
    bio: formData.get('bio') || '',
  };

  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Validation errors:', parsed.error.flatten());
    throw new Error('Invalid person data');
  }

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
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error('Unauthorized');

  await prisma.person.delete({ where: { id } });
  revalidatePath('/admin/people');
  redirect('/admin/people');
}
