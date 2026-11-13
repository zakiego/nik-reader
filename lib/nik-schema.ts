import { z } from "zod";
import { NIK_LENGTH } from "~/lib/const";

const NIK_PATTERN = new RegExp(`^\\d{${NIK_LENGTH}}$`);

/**
 * Single source of truth for validating NIK input. Shared by the REST endpoint
 * and the reader form so the contract can't drift.
 *
 * The NIK has to arrive as a string. Don't bring back `z.coerce`: a NIK sent
 * as a JSON number is already rounded by `JSON.parse` when it is above
 * `Number.MAX_SAFE_INTEGER`, which covers every Papua code (91xx to 97xx), so
 * it would decode to the wrong person without any error.
 */
export const nikSchema = z.object({
  nik: z.string().regex(NIK_PATTERN),
});

export type NikInput = z.infer<typeof nikSchema>;
