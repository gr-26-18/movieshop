'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const genreSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
});

export type GenreFormData = z.infer<typeof genreSchema>;

export async function createGenre(formData: FormData) {
  const raw = {
    name: formData.get('name'),
    description: formData.get('description') || undefined,
  };

  const parsed = genreSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Validation errors:', parsed.error.flatten());
    throw new Error('Invalid genre data');
  }

  await prisma.genre.create({
    data: parsed.data,
  });

  revalidatePath('/admin/genres');
  redirect('/admin/genres');
}

export async function updateGenre(id: string, formData: FormData) {
  const raw = {
    name: formData.get('name'),
    description: formData.get('description') || undefined,
  };

  const parsed = genreSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Validation errors:', parsed.error.flatten());
    throw new Error('Invalid genre data');
  }

  await prisma.genre.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/admin/genres');
  redirect('/admin/genres');
}

export async function deleteGenre(id: string) {
  await prisma.genre.delete({ where: { id } });
  revalidatePath('/admin/genres');
  redirect('/admin/genres');
}

export async function getGenres() {
  return prisma.genre.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { movies: true },
      },
    },
  });
}