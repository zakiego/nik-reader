import { z } from "zod";
import { NIK_LENGTH } from "~/lib/const";

/**
 * Single source of truth for validating NIK input. Reused by the tRPC router,
 * the REST endpoint, and the client-side form so the contract can never drift.
 *
 * The NIK must arrive as a string: a 16-digit JSON number is already rounded
 * by `JSON.parse` (Papua NIKs are above `Number.MAX_SAFE_INTEGER`), so
 * coercing it would decode a different NIK.
 */
export const nikSchema = z.object({
  nik: z.string().length(NIK_LENGTH).regex(/^\d+$/),
});

export type NikInput = z.infer<typeof nikSchema>;
