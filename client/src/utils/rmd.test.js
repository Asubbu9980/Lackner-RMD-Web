import { describe, it, expect } from "vitest";

import calculateSchedule from "../../../server/services/rmdCalculator";
import { DEFAULT_INPUTS } from "../context/RmdContext";
import { getRbdAge, validateInputs, deriveInsights, rowsToCsv, isDeceasedScenario } from "./rmd";

describe("getRbdAge", () => {
  it("follows the SECURE Act birth-year thresholds used by the server", () => {
    expect(getRbdAge(1949)).toBe(70.5);
    expect(getRbdAge(1950)).toBe(72);
    expect(getRbdAge(1953)).toBe(73);
    expect(getRbdAge(1959)).toBe(73);
    expect(getRbdAge(1960)).toBe(75);
  });
});

describe("validateInputs", () => {
  it("accepts the defaults", () => {
    expect(validateInputs(DEFAULT_INPUTS, 2026)).toMatchObject({ isValid: true, warnings: [] });
  });

  it("requires a date of death for inherited scenarios", () => {
    const { errors, isValid } = validateInputs(
      { ...DEFAULT_INPUTS, scenario: "DECEASED_10YEAR", date_Death_Owner: "" },
      2026,
    );
    expect(isValid).toBe(false);
    expect(errors.date_Death_Owner).toBeTruthy();
  });

  it("flags out-of-range numbers", () => {
    const { errors } = validateInputs(
      { ...DEFAULT_INPUTS, balance_Start: 0, growth_Rate: 45, tax_Rate: -1, year_Birth_Owner: 1800 },
      2026,
    );
    expect(Object.keys(errors).sort()).toEqual(
      ["balance_Start", "growth_Rate", "tax_Rate", "year_Birth_Owner"].sort(),
    );
  });

  it("warns when a joint-life spouse is not more than 10 years younger", () => {
    const { warnings } = validateInputs(
      { ...DEFAULT_INPUTS, scenario: "LIVING_JOINT", year_Birth_Owner: 1953, year_Birth_Beny: 1960 },
      2026,
    );
    expect(warnings).toHaveLength(1);
  });

  it("warns that living Roth owners have no lifetime RMDs", () => {
    const { warnings } = validateInputs({ ...DEFAULT_INPUTS, plan: "Roth" }, 2026);
    expect(warnings).toHaveLength(1);
  });
});

describe("deriveInsights", () => {
  it("summarises a living uniform-lifetime projection", () => {
    const result = calculateSchedule(DEFAULT_INPUTS);
    const insights = deriveInsights(result, DEFAULT_INPUTS, 2026);

    expect(insights.ownerAge).toBe(73);
    expect(insights.rmdStartYear).toBe(2026);
    expect(insights.firstRmd).toBe(result.rows[0]);
    expect(insights.firstRmd.rmd).toBeCloseTo(1000000 / 26.5, 2);
    expect(insights.netIncome).toBeCloseTo(result.totalRmd - result.totalTax, 6);
    expect(insights.taxPctOfRmd).toBeCloseTo(24, 6);
    expect(insights.years).toBe(result.rows.length);
  });

  it("finds the first real distribution and depletion under the 10-year rule", () => {
    const inputs = { ...DEFAULT_INPUTS, scenario: "DECEASED_10YEAR", date_Death_Owner: "2024-05-01" };
    const insights = deriveInsights(calculateSchedule(inputs), inputs, 2026);

    expect(isDeceasedScenario(inputs.scenario)).toBe(true);
    expect(insights.firstRmd).toBe(insights.lastRow);
    expect(insights.depleted).toBe(true);
    expect(insights.endingBalance).toBe(0);
  });

  it("is safe before any result has loaded", () => {
    const insights = deriveInsights(null, DEFAULT_INPUTS, 2026);
    expect(insights).toMatchObject({ years: 0, firstRmd: null, depleted: false, rmdPctOfStart: 0 });
  });
});

describe("rowsToCsv", () => {
  it("writes a header plus one rounded line per row", () => {
    const csv = rowsToCsv([
      { year: 2026, age: 73, beginBalance: 1000, rmd: 37.7358, tax: 9.0566, growth: 57.7, endBalance: 1020, cumRmd: 37.7358, cumTax: 9.0566 },
    ]);
    const [header, line] = csv.split("\n");

    expect(header.split(",")).toHaveLength(10);
    expect(line).toBe("2026,73,1000,37.74,9.06,28.68,57.7,1020,37.74,9.06");
  });
});
