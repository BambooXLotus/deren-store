import { z } from 'zod'

export const StoreCreateValidator = z.object({
  name: z.string().min(1),
});

export type StoreCreateRequest = z.infer<typeof StoreCreateValidator>