// Real per-year "candles" from the projection rows (dollars):
//   open  = balance at the start of the year
//   low   = balance right after the RMD is withdrawn
//   close = balance at the end of the year
//   high  = the larger of open and close
// green when the balance grew over the year, red when it fell
export const toCandles = (rows = []) =>
  rows.map((r) => {
    const close = r.endBalance ?? r.balance ?? 0;
    const open = r.beginBalance ?? close - (r.growth || 0) + (r.rmd || 0);
    const low = Math.min(open - (r.rmd || 0), open, close);
    const high = Math.max(open, close);

    return {
      ...r,
      open,
      close,
      high,
      low,
      up: close >= open,
      color: close >= open ? "#10b981" : "#f43f5e",
    };
  });
