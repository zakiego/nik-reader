import type { NextApiRequest, NextApiResponse } from "next";
import { nikSchema } from "~/lib/nik-schema";
import { extractDataFromNIK } from "~/utils/read";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const parsed = nikSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "NIK is not valid, character length must be 16" });
  }

  const data = extractDataFromNIK(parsed.data.nik);

  return res.status(200).json(data);
}
