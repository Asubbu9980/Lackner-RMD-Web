// =====================================================
// SCENARIOS
// =====================================================

export const SCENARIOS = [
  {
    id: "LIVING_UNIFORM",
    chart: "01",
    title: "Uniform Lifetime",
    group: "living",
    description: "Owner is living. Standard IRS Uniform Lifetime Table.",
  },
  {
    id: "LIVING_JOINT",
    chart: "00",
    title: "Spouse >10 Years Younger",
    group: "living",
    description:
      "Owner is living and the sole beneficiary is a spouse more than 10 years younger. Smaller RMDs.",
    usesBeneficiary: true,
  },
  {
    id: "DECEASED_SPOUSE_INHERIT",
    chart: "03",
    title: "Spouse Inherited",
    group: "inherited",
    description: "Surviving spouse inherits the account and takes lifetime distributions.",
    usesBeneficiary: true,
  },
  {
    id: "DECEASED_EDB_SINGLELIFE",
    chart: "05",
    title: "Non-Spouse EDB",
    group: "inherited",
    description:
      "Eligible designated beneficiary stretches distributions over their single life expectancy.",
    usesBeneficiary: true,
  },
  {
    id: "DECEASED_10YEAR",
    chart: "11",
    title: "10-Year Rule",
    group: "inherited",
    description: "Beneficiary must empty the account by the end of year 10. No annual minimum.",
    usesBeneficiary: true,
  },
  {
    id: "DECEASED_10YEAR_ANNUAL",
    chart: "12",
    title: "10-Year Rule + Annual RMDs",
    group: "inherited",
    description:
      "Annual RMDs in years 1–9, then the remaining balance is distributed in year 10.",
    usesBeneficiary: true,
  },
];

export const SCENARIO_GROUPS = [
  { id: "living", label: "Owner living" },
  { id: "inherited", label: "Inherited (owner deceased)" },
];

export const getScenario = (id) =>
  SCENARIOS.find((s) => s.id === id) || SCENARIOS[0];

export const isDeceasedScenario = (id) => getScenario(id).group === "inherited";

// =====================================================
// PLANS
// =====================================================

export const PLAN_TYPES = [
  { id: "IRA", label: "Traditional IRA", short: "IRA" },
  { id: "401k", label: "401(k)", short: "401(k)" },
  { id: "Roth", label: "Roth IRA", short: "Roth" },
];

export const getPlan = (id) => PLAN_TYPES.find((p) => p.id === id) || PLAN_TYPES[0];

// =====================================================
// RBD AGE — mirrors server/services/rmdCalculator.js
// =====================================================

export const getRbdAge = (yearOfBirth) => {
  if (yearOfBirth <= 1949) return 70.5;
  if (yearOfBirth <= 1950) return 72;
  if (yearOfBirth <= 1959) return 73;
  return 75;
};

// =====================================================
// VALIDATION
// =====================================================

export const validateInputs = (inputs, thisYear = new Date().getFullYear()) => {
  const errors = {};
  const warnings = [];

  if (!(inputs.balance_Start > 0)) {
    errors.balance_Start = "Enter a starting balance above $0.";
  }

  if (inputs.growth_Rate < -20 || inputs.growth_Rate > 30) {
    errors.growth_Rate = "Use a growth rate between -20% and 30%.";
  }

  if (inputs.tax_Rate < 0 || inputs.tax_Rate > 60) {
    errors.tax_Rate = "Use a tax rate between 0% and 60%.";
  }

  if (inputs.year_Birth_Owner < 1900 || inputs.year_Birth_Owner > thisYear) {
    errors.year_Birth_Owner = `Enter a year between 1900 and ${thisYear}.`;
  }

  if (inputs.year_Birth_Beny < 1900 || inputs.year_Birth_Beny > thisYear) {
    errors.year_Birth_Beny = `Enter a year between 1900 and ${thisYear}.`;
  }

  if (isDeceasedScenario(inputs.scenario) && !inputs.date_Death_Owner) {
    errors.date_Death_Owner = "Required for inherited scenarios.";
  }

  if (
    inputs.scenario === "LIVING_JOINT" &&
    inputs.year_Birth_Beny - inputs.year_Birth_Owner <= 10
  ) {
    warnings.push(
      "The joint-life table only applies when the spouse is more than 10 years younger than the owner.",
    );
  }

  if (inputs.plan === "Roth" && !isDeceasedScenario(inputs.scenario)) {
    warnings.push(
      "Original Roth IRA owners have no lifetime RMDs. This projection shows what they would be.",
    );
  }

  return { errors, warnings, isValid: Object.keys(errors).length === 0 };
};

// =====================================================
// INSIGHTS
// =====================================================

const DEPLETED_THRESHOLD = 1000; // the server stops projecting below this balance

export const deriveInsights = (result, inputs, thisYear = new Date().getFullYear()) => {
  const rows = result?.rows || [];

  const withdrawalRows = rows.filter((r) => r.rmd > 0);

  const firstRmd = withdrawalRows[0] || null;

  const peakRmd = withdrawalRows.reduce(
    (best, r) => (!best || r.rmd > best.rmd ? r : best),
    null,
  );

  const lastRow = rows[rows.length - 1] || null;

  const totalRmd = result?.totalRmd || 0;
  const totalTax = result?.totalTax || 0;
  const balanceStart = result?.balanceStart || 0;
  const endingBalance = result?.endingBalance || 0;

  return {
    ownerAge: thisYear - inputs.year_Birth_Owner,
    benyAge: thisYear - inputs.year_Birth_Beny,
    rbdAge: getRbdAge(inputs.year_Birth_Owner),
    rmdStartYear: inputs.year_Birth_Owner + Math.floor(getRbdAge(inputs.year_Birth_Owner)),

    years: rows.length,
    firstRmd,
    peakRmd,
    lastRow,

    totalRmd,
    totalTax,
    totalGrowth: result?.totalGrowth || 0,
    netIncome: totalRmd - totalTax,
    avgRmd: withdrawalRows.length ? totalRmd / withdrawalRows.length : 0,

    balanceStart,
    endingBalance,
    depleted: rows.length > 0 && endingBalance < DEPLETED_THRESHOLD,

    rmdPctOfStart: balanceStart ? (totalRmd / balanceStart) * 100 : 0,
    taxPctOfRmd: totalRmd ? (totalTax / totalRmd) * 100 : 0,
  };
};

// =====================================================
// CSV
// =====================================================

const CSV_COLUMNS = [
  ["Year", (r) => r.year],
  ["Age", (r) => r.age],
  ["Beginning Balance", (r) => r.beginBalance],
  ["RMD", (r) => r.rmd],
  ["Tax", (r) => r.tax],
  ["Net After Tax", (r) => r.rmd - r.tax],
  ["Growth", (r) => r.growth],
  ["Ending Balance", (r) => r.endBalance],
  ["Cumulative RMD", (r) => r.cumRmd],
  ["Cumulative Tax", (r) => r.cumTax],
];

export const rowsToCsv = (rows) => {
  const header = CSV_COLUMNS.map(([label]) => label).join(",");

  const body = rows.map((r) =>
    CSV_COLUMNS.map(([, get]) => {
      const v = get(r);
      return typeof v === "number" ? Math.round(v * 100) / 100 : v;
    }).join(","),
  );

  return [header, ...body].join("\n");
};
