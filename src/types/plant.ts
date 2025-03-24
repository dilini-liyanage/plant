import { z } from 'zod';

export const PlantSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Plant name is required'),
  scientificName: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  careInstructions: z.string().min(1, 'Care instructions are required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string(),
        publicId: z.string(),
      })
    )
    .min(1, 'At least one image is required'),
  featured: z.boolean().default(false),
  price: z.number().optional(),
  stock: z.number().optional(),
  seoMetadata: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// export type Plant = z.infer<typeof PlantSchema>;

// First, create a types file to define the categories
export const PLANT_CATEGORIES = [
  'Indoor Plants',
  'Outdoor Plants',
  'Succulents',
  'Flowering Plants',
  'Air Purifying Plants',
  'Low Light Plants',
  'Pet Friendly Plants',
  'Large Plants',
] as const;

export type PlantCategory = (typeof PLANT_CATEGORIES)[number];

export interface Plant {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categories: PlantCategory[];
  careGuides: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
