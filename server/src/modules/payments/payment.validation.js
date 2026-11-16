import { z } from "zod";

export const simulatePaymentSchema = z.object({
  outcome: z.enum(["success", "failed"]),
});
