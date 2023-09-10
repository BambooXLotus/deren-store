import { z } from "zod";

export const BillboardFormValidator = z.object({
  label: z.string().min(1),
  imageUrl: z.string().url().min(1)
});
export type BillboardRequest = z.infer<typeof BillboardFormValidator>