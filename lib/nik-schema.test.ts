import { describe, expect, it } from "vitest";
import { nikSchema } from "./nik-schema";
import { SAMPLE_NIK } from "./nik-segments";

// A made-up Papua NIK. Province 91 puts it above Number.MAX_SAFE_INTEGER, so
// it is the case that breaks when a NIK travels as a number.
const PAPUA_NIK = "9171010101900001";

const accepts = (nik: unknown) => nikSchema.safeParse({ nik }).success;

describe("nikSchema", () => {
  it("accepts 16 digits as a string", () => {
    expect(accepts(SAMPLE_NIK)).toBe(true);
    expect(accepts(PAPUA_NIK)).toBe(true);
  });

  it("rejects 16 characters that are not all digits", () => {
    expect(accepts("abcdefghijklmnop")).toBe(false);
    expect(accepts(`${SAMPLE_NIK.slice(0, 15)}a`)).toBe(false);
    expect(accepts(`${SAMPLE_NIK.slice(0, 4)} ${SAMPLE_NIK.slice(5)}`)).toBe(
      false,
    );
  });

  it("rejects the wrong length", () => {
    expect(accepts(SAMPLE_NIK.slice(0, 15))).toBe(false);
    expect(accepts(`${SAMPLE_NIK}4`)).toBe(false);
    expect(accepts(`${SAMPLE_NIK}\n`)).toBe(false);
  });

  it("rejects a NIK sent as a JSON number", () => {
    const body = (raw: string) => nikSchema.safeParse(JSON.parse(raw)).success;
    expect(body(`{"nik":${PAPUA_NIK}}`)).toBe(false);
    expect(body(`{"nik":${SAMPLE_NIK}}`)).toBe(false);
  });
});
