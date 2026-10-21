import { createContext, useState, useEffect, useCallback } from "react";
import { calculateRmd } from "../services/api";

// eslint-disable-next-line react-refresh/only-export-components
export const RmdContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_INPUTS = {
  balance_Start: 1000000,
  growth_Rate: 6,
  tax_Rate: 24,
  year_Birth_Owner: 1953,
  year_Birth_Beny: 1965,
  date_Death_Owner: "",
  scenario: "LIVING_UNIFORM",
  plan: "IRA",
};

export const RmdProvider = ({ children }) => {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // the inputs the current result (or error) belongs to; while they differ
  // from `inputs`, a recalculation is pending (debounce + request)
  const [settledInputs, setSettledInputs] = useState(null);

  const updateInput = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetInputs = useCallback(() => setInputs(DEFAULT_INPUTS), []);

  useEffect(() => {
    // a newer change supersedes this request, so a slow stale response
    // can't overwrite the latest result
    let stale = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await calculateRmd(inputs);
        if (stale) return;
        setResult(res.result);
        setError(null);
      } catch (err) {
        if (stale) return;
        console.error(err);
        setError("Couldn't reach the calculation server. Showing the last successful result.");
      } finally {
        if (!stale) {
          setLoading(false);
          setSettledInputs(inputs);
        }
      }
    }, 300);

    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [inputs]);

  const calculating = settledInputs !== inputs;

  return (
    <RmdContext.Provider
      value={{ inputs, setInputs, updateInput, resetInputs, result, loading, calculating, error }}
    >
      {children}
    </RmdContext.Provider>
  );
};
