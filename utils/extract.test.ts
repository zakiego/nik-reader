import { describe, expect, it } from "vitest";
import { getBirthDate, getBirthDateDetails } from "./extract";

// 9 November 2026, mid-afternoon local time.
const now = new Date(2026, 10, 9, 15, 30);

const decode = (idBirthDate: string) => getBirthDate({ idBirthDate, now });

describe("getBirthDate", () => {
  it("reads a past year in the 2000s", () => {
    expect(decode("120323")).toBe("12/03/2023");
    expect(decode("010100")).toBe("01/01/2000");
  });

  it("reads a year after the current one in the 1900s", () => {
    expect(decode("120395")).toBe("12/03/1995");
    expect(decode("010127")).toBe("01/01/1927");
  });

  it("subtracts 40 from the day for women", () => {
    expect(decode("520395")).toBe("12/03/1995");
    expect(decode("410100")).toBe("01/01/2000");
  });

  it("keeps the current year up to today", () => {
    expect(decode("091126")).toBe("09/11/2026");
    expect(decode("011126")).toBe("01/11/2026");
  });

  it("moves a later date in the current year to the 1900s", () => {
    expect(decode("101126")).toBe("10/11/1926");
    expect(decode("011226")).toBe("01/12/1926");
  });

  it("returns null for digits that aren't a date", () => {
    expect(decode("310295")).toBeNull();
    expect(decode("001395")).toBeNull();
    expect(decode("12039")).toBeNull();
    expect(decode("12ab95")).toBeNull();
  });

  it("accepts the digits as a number", () => {
    expect(getBirthDate({ idBirthDate: 120395, now })).toBe("12/03/1995");
  });
});

describe("getBirthDateDetails", () => {
  it("returns the age on the given day", () => {
    expect(getBirthDateDetails({ idBirthDate: "120395", now })?.age).toBe(31);
    expect(getBirthDateDetails({ idBirthDate: "101195", now })?.age).toBe(30);
    expect(getBirthDateDetails({ idBirthDate: "091195", now })?.age).toBe(31);
  });

  it("offers the 1900s year when it picked the 2000s", () => {
    expect(
      getBirthDateDetails({ idBirthDate: "120325", now })?.otherCenturyYear,
    ).toBe(1925);
  });

  it("offers no other year when the 2000s would be in the future", () => {
    expect(
      getBirthDateDetails({ idBirthDate: "120395", now })?.otherCenturyYear,
    ).toBeNull();
  });
});
