import { describe, expect, it } from "vitest";
import { nikSchema } from "./nik-schema";

const accepts = (nik: unknown) => nikSchema.safeParse({ nik }).success;

describe("nikSchema", () => {
  it("accepts 16 digits as a string", () => {
    expect(accepts("3171014101900123")).toBe(true);
    expect(accepts("9171014101900123")).toBe(true);
  });

  it("rejects 16 characters that are not all digits", () => {
    expect(accepts("abcdefghijklmnop")).toBe(false);
    expect(accepts("317101410190012a")).toBe(false);
    expect(accepts("3171 01410190012")).toBe(false);
  });

  it("rejects the wrong length", () => {
    expect(accepts("317101410190012")).toBe(false);
    expect(accepts("31710141019001234")).toBe(false);
  });

  it("rejects a NIK sent as a JSON number", () => {
    // JSON.parse has already rounded this one to ...0124 before validation.
    const body = (raw: string) => nikSchema.safeParse(JSON.parse(raw)).success;
    expect(body('{"nik":9171014101900123}')).toBe(false);
    expect(body('{"nik":3171014101900123}')).toBe(false);
  });
});
