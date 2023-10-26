import { z } from "zod";

export const CheckoutValidator = z.object({
  productIds: z.string().array()
});
export type CheckoutRequest = z.infer<typeof CheckoutValidator>