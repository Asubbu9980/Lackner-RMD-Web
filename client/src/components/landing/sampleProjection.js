/*
 * Illustrative sample projection for the home page 3D chart. Not client data.
 * RMDs follow the IRS Uniform Lifetime Table; yearly growth varies randomly
 * around 7% from a fixed seed, so the curve looks real but never changes
 * between visits. Rows match the shape of the live calculation's result.rows.
 */

const START_BALANCE = 1_350_000;
const START_AGE = 73;
const START_YEAR = 2026;
const TAX_RATE = 0.24;

// IRS Uniform Lifetime Table divisors, ages 73–104
const DIVISORS = [
  26.5, 25.5, 24.6, 23.7, 22.9, 22.0, 21.1, 20.2, 19.4, 18.5, 17.7, 16.8, 16.0, 15.2, 14.4, 13.7,
  12.9, 12.2, 11.5, 10.8, 10.1, 9.5, 8.9, 8.4, 7.8, 7.3, 6.8, 6.4, 6.0, 5.6, 5.2, 4.9,
];

// small seeded PRNG (mulberry32): same "random" numbers on every load
const seeded = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const random = seeded(73);

let balance = START_BALANCE;

export const SAMPLE_ROWS = DIVISORS.map((divisor, i) => {
  const startBalance = balance;
  const rmd = startBalance / divisor;
  const tax = rmd * TAX_RATE;
  const growthRate = 0.07 + (random() - 0.5) * 0.06; // 4%–10%
  const growth = (startBalance - rmd) * growthRate;
  balance = startBalance - rmd + growth;

  return {
    age: START_AGE + i,
    year: START_YEAR + i,
    startBalance,
    rmd,
    tax,
    growth,
    endBalance: balance,
  };
});

const sum = (key) => SAMPLE_ROWS.reduce((s, r) => s + r[key], 0);

const peak = SAMPLE_ROWS.reduce((best, r) => (r.endBalance > best.endBalance ? r : best));

export const SAMPLE_SUMMARY = {
  startBalance: START_BALANCE,
  totalRmd: sum("rmd"),
  totalTax: sum("tax"),
  endingBalance: SAMPLE_ROWS[SAMPLE_ROWS.length - 1].endBalance,
  years: SAMPLE_ROWS.length,
  firstRmd: SAMPLE_ROWS[0],
  peak,
};
