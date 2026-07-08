import { z } from "zod";
import { NIK_LENGTH } from "~/lib/const";

/**
 * Single source of truth for validating NIK input. Reused by the tRPC router,
 * the REST endpoint, and the client-side form so the contract can never drift.
 */
export const nikSchema = z.object({
  nik: z.coerce.string().length(NIK_LENGTH),
});

export type NikInput = z.infer<typeof nikSchema>;
