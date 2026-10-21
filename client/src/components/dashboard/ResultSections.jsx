import { useOutletContext } from "react-router-dom";

import { FileSpreadsheet } from "lucide-react";

import AdvancedChart from "../AdvancedChart";
import WaterfallChart from "../WaterfallChart";
import DataTable from "../DataTable";
import ErrorBoundary from "../ErrorBoundary";
import CinematicPanel from "./CinematicPanel";

import useScenarioActions from "../../hooks/useScenarioActions";
import { useRenderMode } from "../../context/RenderModeContext";

// Interactive 3D/2D charts, or Manim videos when the 3Blue1Brown engine is on
export const ProjectionSection = () => {
  const { renderMode } = useRenderMode();
  const { cinematic } = useOutletContext();

  if (renderMode === "python") return <CinematicPanel cinematic={cinematic} />;

  return (
    <ErrorBoundary>
      <AdvancedChart />
    </ErrorBoundary>
  );
};

export const WaterfallSection = () => (
  <ErrorBoundary>
    <WaterfallChart />
  </ErrorBoundary>
);

export const TableSection = () => {
  const { exportCsv, canExportCsv } = useScenarioActions();

  return (
    <div className="space-y-2">
      <div className="flex justify-end print:hidden">
        <button
          type="button"
          onClick={exportCsv}
          disabled={!canExportCsv}
          className="
            flex
            items-center
            gap-1.5
            rounded-lg
            border
            border-[var(--border-color)]
            bg-[var(--bg-secondary)]
            px-3
            py-1.5
            text-xs
            font-semibold
            text-[var(--text-primary)]
            hover:bg-[var(--hover-bg)]
            disabled:opacity-50
          "
        >
          <FileSpreadsheet size={14} />
          Export CSV
        </button>
      </div>

      <DataTable />
    </div>
  );
};

export const ResultsSkeleton = () => (
  <div className="space-y-3" aria-busy="true" aria-label="Loading projection">
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-[104px] animate-pulse rounded-[var(--card-radius)] bg-[var(--hover-bg)]" />
      ))}
    </div>
    <div className="h-[420px] animate-pulse rounded-[var(--card-radius)] bg-[var(--hover-bg)]" />
  </div>
);
