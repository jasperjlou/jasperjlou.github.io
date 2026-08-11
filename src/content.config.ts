import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categories = z.union([z.string(), z.array(z.string())]).default([]);

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './source/_posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    slug: z.string(),
    description: z.string(),
    categories,
    tags: z.array(z.string()).default([]),
    project: z.string().optional(),
    stage: z.string().optional(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    englishTitle: z.string(),
    order: z.number().default(0),
    status: z.string(),
    statusDetail: z.string(),
    description: z.string(),
    summary: z.string(),
    liveUrl: z.url(),
    githubUrl: z.url(),
    launched: z.string(),
    lastVerified: z.coerce.date(),
    heroImage: z.string(),
    heroAlt: z.string(),
    metrics: z.array(z.object({
      value: z.string(),
      label: z.string(),
      note: z.string().optional(),
    })),
    features: z.array(z.object({
      index: z.string(),
      title: z.string(),
      description: z.string(),
    })),
    principles: z.array(z.string()),
    stack: z.array(z.string()),
  }),
});

export const collections = { posts, projects };
