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

  const updateInput = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetInputs = useCallback(() => setInputs(DEFAULT_INPUTS), []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await calculateRmd(inputs);
        setResult(res.result);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Couldn't reach the calculation server. Showing the last successful result.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputs]);

  return (
    <RmdContext.Provider
      value={{ inputs, setInputs, updateInput, resetInputs, result, loading, error }}
    >
      {children}
    </RmdContext.Provider>
  );
};
