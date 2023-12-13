import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { extractDataFromNIK } from "~/utils/read";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nik } = req.body;

  const validate = z.coerce.string().length(16);

  const isValid = validate.safeParse(nik);

  if (!isValid.success) {
    return res
      .status(400)
      .json({ message: "NIK is not valid, character length must be 16" });
  }

  const data = extractDataFromNIK(nik);

  res.status(200).json(data);
}
