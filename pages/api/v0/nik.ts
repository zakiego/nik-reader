import { nikSchema } from "~/lib/nik-schema";
import { extractDataFromNIK } from "~/utils/read";

export const config = {
  runtime: "edge",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export default async function handler(req: Request) {
  // The edge runtime hands over a raw Request, so the JSON body has to be
  // parsed here instead of relying on Next.js' Node body parser.
  const body = await req.json().catch(() => null);
  const parsed = nikSchema.safeParse(body);

  if (!parsed.success) {
    return json(
      { message: "NIK is not valid, character length must be 16" },
      400,
    );
  }

  return json(await extractDataFromNIK(parsed.data.nik));
}
