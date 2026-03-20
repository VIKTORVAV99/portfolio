import { describe, it, expect } from "bun:test";

import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("returns ISO date", () => {
    expect(formatDate("2025-03-20")).toBe("2025-03-20");
  });
});
