import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Non-strict by default: additional keys are reserved for forward compatibility.
const referenceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  accessed: z.string().optional(),
  authors: z.string().optional(),
  year: z.number().optional(),
  note: z.string().optional(),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        learning_objectives: z.array(z.string()).min(1).optional(),
        prerequisites: z.array(z.string()).optional(),
        estimated_minutes: z.number().int().positive().optional(),
        references: z.array(z.union([
          z.string(),
          referenceSchema,
        ])).min(1).optional(),
      }),
    }),
  }),
};
