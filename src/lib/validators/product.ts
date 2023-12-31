import { z } from "zod";

export const ProductFormValidator = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string().url() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional()
});
export type ProductRequest = z.infer<typeof ProductFormValidator>