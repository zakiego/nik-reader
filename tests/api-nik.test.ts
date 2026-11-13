import { describe, expect, it } from "vitest";
import { SAMPLE_NIK } from "~/lib/nik-segments";
import handler from "~/pages/api/v0/nik";

// This file lives outside `pages/` on purpose: the Pages Router turns every
// file in there into a route.

const post = (body: string) =>
  handler(
    new Request("https://nik.zakiego.com/api/v0/nik", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }),
  );

describe("POST /api/v0/nik", () => {
  it("decodes a NIK sent as a string", async () => {
    const res = await post(JSON.stringify({ nik: SAMPLE_NIK }));

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      provinsi: "JAWA BARAT",
      uniqueId: "0001",
    });
  });

  it("returns 400 for a NIK sent as a JSON number", async () => {
    // Above Number.MAX_SAFE_INTEGER, so JSON.parse would round the last digits.
    expect((await post('{"nik":9171010101900001}')).status).toBe(400);
    expect((await post(`{"nik":${SAMPLE_NIK}}`)).status).toBe(400);
  });

  it("returns 400 for a body that isn't a 16-digit NIK", async () => {
    expect((await post('{"nik":"abcdefghijklmnop"}')).status).toBe(400);
    expect((await post("{}")).status).toBe(400);
    expect((await post("not json")).status).toBe(400);
  });
});
