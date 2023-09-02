import { z } from 'zod'

export const StoreValidator = z.object({
  name: z.string().min(1),
});

export type StoreCreateRequest = z.infer<typeof StoreValidator>