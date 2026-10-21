import { useState } from "react";

import useRmd from "./useRmd";
import { DEFAULT_INPUTS } from "../context/RmdContext";
import { getPlan, getScenario, rowsToCsv } from "../utils/rmd";
import { formatCompact } from "../utils/format";

const STORAGE_KEY = "rmd.savedScenarios";

const readSaved = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const writeSaved = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable (private mode) — saved scenarios just won't persist
  }
};

const download = (filename, content, type) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Keep only known input keys so an imported file can't inject junk into state
const sanitize = (raw) =>
  Object.fromEntries(
    Object.keys(DEFAULT_INPUTS).map((key) => [key, raw?.[key] ?? DEFAULT_INPUTS[key]]),
  );

export const describeInputs = (inputs) =>
  `${getPlan(inputs.plan).short} · ${getScenario(inputs.scenario).title} · ${formatCompact(inputs.balance_Start)}`;

export default function useScenarioActions() {
  const { inputs, setInputs, resetInputs, result } = useRmd();

  const [saved, setSaved] = useState(readSaved);

  const persist = (list) => {
    setSaved(list);
    writeSaved(list);
  };

  const saveCurrent = (name) => {
    const entry = {
      id: Date.now().toString(36),
      name: name?.trim() || describeInputs(inputs),
      savedAt: new Date().toISOString(),
      inputs,
    };
    persist([entry, ...saved]);
  };

  const loadSaved = (id) => {
    const entry = saved.find((s) => s.id === id);
    if (entry) setInputs(sanitize(entry.inputs));
  };

  const removeSaved = (id) => persist(saved.filter((s) => s.id !== id));

  const exportJson = () =>
    download("rmd-inputs.json", JSON.stringify(inputs, null, 2), "application/json");

  const exportCsv = () => {
    if (!result?.rows?.length) return;
    download("rmd-projection.csv", rowsToCsv(result.rows), "text/csv");
  };

  const importJson = async (file) => {
    const text = await file.text();
    setInputs(sanitize(JSON.parse(text)));
  };

  return {
    saved,
    saveCurrent,
    loadSaved,
    removeSaved,
    exportJson,
    exportCsv,
    importJson,
    print: () => window.print(),
    reset: resetInputs,
    canExportCsv: Boolean(result?.rows?.length),
  };
}
