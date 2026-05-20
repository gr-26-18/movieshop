
'use server';

import { prisma } from '@/lib/prisma';
import { isAdminUser } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().int().positive('Price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  runtime: z.coerce.number().int().positive('Runtime must be positive').nullable().optional(),
  releaseDate: z.coerce.date({ message: 'Invalid date' }),
  imageUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  genreIds: z.array(z.string()).optional().default([]),
  directorId: z.array(z.string()).optional().default([]),
  actorIds: z.array(z.string()).optional().default([]),
});

export type MovieFormData = z.infer<typeof movieSchema>;

export async function createMovie(formData: FormData) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error('Unauthorized');

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    runtime: formData.get('runtime') || null,
    releaseDate: formData.get('releaseDate'),
    imageUrl: formData.get('imageUrl') || '',
    genreIds: formData.getAll('genreIds'),
    directorId: formData.getAll('directorId'),
    actorIds: formData.getAll('actorIds'),
  };

  const parsed = movieSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Validation errors:', parsed.error.flatten());
    throw new Error('Invalid movie data');
  }

  const { genreIds, directorId, actorIds, ...movieData } = parsed.data;

  await prisma.$transaction(async (tx) => {
    const movie = await tx.movie.create({
      data: {
        ...movieData,
        imageUrl: movieData.imageUrl || null,
        genres: {
          connect: genreIds.map((id) => ({ id })),
        },
      },
    });

    for (const personId of directorId) {
      await tx.movieCredit.create({
        data: { movieId: movie.id, personId, role: 'DIRECTOR' },
      });
    }

    for (const personId of actorIds) {
      await tx.movieCredit.create({
        data: { movieId: movie.id, personId, role: 'ACTOR' },
      });
    }
  });

  revalidatePath('/admin/movies');
  redirect('/admin/movies');
}

export async function updateMovie(id: string, formData: FormData) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error('Unauthorized');

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    runtime: formData.get('runtime') || null,
    releaseDate: formData.get('releaseDate'),
    imageUrl: formData.get('imageUrl') || '',
    genreIds: formData.getAll('genreIds'),
    directorId: formData.getAll('directorId'),
    actorIds: formData.getAll('actorIds'),
  };

  const parsed = movieSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Validation errors:', parsed.error.flatten());
    throw new Error('Invalid movie data');
  }

  const { genreIds, directorId, actorIds, imageUrl, ...movieData } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.movie.update({
      where: { id },
      data: {
        ...movieData,
        imageUrl: imageUrl || null,
        genres: {
          set: genreIds.map((id) => ({ id })),
        },
      },
    });

    await tx.movieCredit.deleteMany({ where: { movieId: id } });

    for (const personId of directorId) {
      await tx.movieCredit.create({
        data: { movieId: id, personId, role: 'DIRECTOR' },
      });
    }

    for (const personId of actorIds) {
      await tx.movieCredit.create({
        data: { movieId: id, personId, role: 'ACTOR' },
      });
    }
  });

  revalidatePath('/admin/movies');
  redirect('/admin/movies');
}

export async function deleteMovie(id: string) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error('Unauthorized');

  await prisma.movie.delete({ where: { id } });
  revalidatePath('/admin/movies');
  redirect('/admin/movies');
}
