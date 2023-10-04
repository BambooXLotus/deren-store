import { z } from "zod";

export const ColorFormValidator = z.object({
  name: z.string().min(1),
  value: z.string().min(4).max(9).regex(/^#/, {
    message: 'String must be a valid hex code'
  })
});
export type ColorRequest = z.infer<typeof ColorFormValidator>