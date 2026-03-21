import { describe, it, expect } from "bun:test";

import { toISOStartDate, toISOEndDate } from "./index";

describe("toISOStartDate", () => {
  it("floors month-only date to the 1st", () => {
    expect(toISOStartDate("2025-07")).toBe("2025-07-01T00:00:00.000Z");
  });

  it("floors December to the 1st", () => {
    expect(toISOStartDate("2022-12")).toBe("2022-12-01T00:00:00.000Z");
  });

  it("passes through a full date", () => {
    expect(toISOStartDate("2025-07-15")).toBe("2025-07-15T00:00:00.000Z");
  });
});

describe("toISOEndDate", () => {
  it("ceils month-only date to last day of a 30-day month", () => {
    expect(toISOEndDate("2025-06")).toBe("2025-06-30T00:00:00.000Z");
  });

  it("ceils month-only date to last day of a 31-day month", () => {
    expect(toISOEndDate("2025-01")).toBe("2025-01-31T00:00:00.000Z");
  });

  it("ceils February in a non-leap year to the 28th", () => {
    expect(toISOEndDate("2025-02")).toBe("2025-02-28T00:00:00.000Z");
  });

  it("ceils February in a leap year to the 29th", () => {
    expect(toISOEndDate("2024-02")).toBe("2024-02-29T00:00:00.000Z");
  });

  it("passes through a full date", () => {
    expect(toISOEndDate("2025-06-15")).toBe("2025-06-15T00:00:00.000Z");
  });
});
