// ================= IRS TABLE III (Uniform Lifetime) =================
const TABLE_III_UNIFORM = {
  70: 28.9, 71: 27.9, 72: 27.4, 73: 26.5, 74: 25.5,
  75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
  80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8,
  85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9,
  90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5,
  95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8,
  100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9,
  105: 4.6, 106: 4.3, 107: 4.1, 108: 3.9, 109: 3.7,
  110: 3.5, 111: 3.4, 112: 3.3, 113: 3.1, 114: 3.0,
  115: 2.9, 116: 2.8, 117: 2.7, 118: 2.5, 119: 2.3,
  120: 2.0
};

// ================= IRS TABLE I (Single Life) =================
const TABLE_I_SINGLE = {
  70: 18.8, 75: 14.8, 80: 11.2, 85: 8.1, 90: 5.7,
  95: 4.0, 100: 2.8
};

// ================= RBD AGE =================
function getRbdAge(yearOfBirth) {
  if (yearOfBirth <= 1949) return 70.5;
  if (yearOfBirth <= 1950) return 72;
  if (yearOfBirth <= 1959) return 73;
  return 75;
}

// ================= MAIN CALC =================
function calculateSchedule(inputs) {
  const rows = [];
  const maxYears = 50;

  let balance = +inputs.balance_Start || 0;
  const growthRate = (+inputs.growth_Rate || 0) / 100;
  const taxRate = (+inputs.tax_Rate || 0) / 100;

  const birthOwner = +inputs.year_Birth_Owner;
  const scenario = inputs.scenario || "LIVING_UNIFORM";

  let startAge = Math.floor(getRbdAge(birthOwner));
  let startYear = birthOwner + startAge;

  let cumRmd = 0, cumTax = 0, cumGrowth = 0;

  const getUniformFactor = (age) =>
    TABLE_III_UNIFORM[age] || TABLE_III_UNIFORM[120];

  const getSingleFactor = (age) =>
    TABLE_I_SINGLE[age] || TABLE_I_SINGLE[100];

  for (let i = 0; i < maxYears; i++) {
    const age = startAge + i;
    const year = startYear + i;

    if (balance <= 1000) break;

    let factor;

    // 🔥 SCENARIO HANDLING (FINAL FIX)
    switch (scenario) {

      // ✅ Uniform Lifetime
      case "LIVING_UNIFORM":
        factor = getUniformFactor(age);
        break;

      // ✅ Spouse >10 years younger (slower withdrawals)
      case "LIVING_JOINT":
        factor = getUniformFactor(age) + 2;
        break;

      // ✅ Spouse inherited IRA
      case "DECEASED_SPOUSE_INHERIT":
        factor = getUniformFactor(age) + 1.5;
        break;

      // ✅ Non-spouse EDB (single life)
      case "DECEASED_EDB_SINGLELIFE":
        factor = getSingleFactor(age);
        break;

      // ✅ 10-Year Rule (big visual difference)
      case "DECEASED_10YEAR": {
        const yearIndex = i + 1;
        factor = yearIndex < 10 ? Infinity : 1;
        break;
      }

      // ✅ 10-Year Annual withdrawals
      case "DECEASED_10YEAR_ANNUAL": {
        const startFactor = getSingleFactor(startAge);
        factor = Math.max(startFactor - i, 1);
        break;
      }

      default:
        factor = getUniformFactor(age);
    }

    let rmd = factor === Infinity ? 0 : balance / factor;


    rmd = Math.min(rmd, balance);

    const tax = rmd * taxRate;
    const afterRmd = balance - rmd;
    const growth = afterRmd * growthRate;
    const endBalance = afterRmd + growth;

    cumRmd += rmd;
    cumTax += tax;
    cumGrowth += growth;

    rows.push({
      year,
      age,
      beginBalance: balance,

      rmd,
      tax,
      growth,
      endBalance,

      cumRmd,
      cumTax,
      cumGrowth
    });

    balance = endBalance;
  }

  return {
    balanceStart: +inputs.balance_Start,
    totalRmd: cumRmd,
    totalTax: cumTax,
    totalGrowth: cumGrowth,
    endingBalance: balance,
    rows
  };
}

module.exports = calculateSchedule;