import { z } from 'zod'

export const StoreCreateValidator = z.object({
  name: z.string().min(1),
});
export type StoreCreateRequest = z.infer<typeof StoreCreateValidator>

export const StoreEditValidator = z.object({
  name: z.string().min(1),
})
export type StoreEditRequest = z.infer<typeof StoreEditValidator>