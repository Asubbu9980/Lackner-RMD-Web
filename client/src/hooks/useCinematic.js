import { useState } from "react";

import useRmd from "./useRmd";
import { API_BASE, generateProjection } from "../services/pythonapi";
import { isDeceasedScenario } from "../utils/rmd";

export const CINEMATIC_SCENES = [
  {
    id: "projection",
    title: "Projection Analysis",
    description: "Balance, growth and withdrawals across the full projection.",
    accent: "from-cyan-500 to-blue-600",
  },
  {
    id: "rmd",
    title: "RMD Analysis",
    description: "How each year's required distribution is derived.",
    accent: "from-purple-500 to-indigo-600",
  },
  {
    id: "tax",
    title: "Tax Analysis",
    description: "The tax drag taken out of every distribution.",
    accent: "from-rose-500 to-red-600",
  },
  {
    id: "collapse",
    title: "Collapse Analysis",
    description: "How quickly the portfolio winds down to zero.",
    accent: "from-amber-500 to-orange-600",
  },
];

// Drives a Manim render on the Python backend and tracks its progress.
export default function useCinematic() {
  const { inputs } = useRmd();

  const [videoUrl, setVideoUrl] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [scene, setScene] = useState(null);

  const generate = async (sceneId) => {
    if (isDeceasedScenario(inputs.scenario) && !inputs.date_Death_Owner) {
      setError("Date of death is required for this scenario.");
      return;
    }

    setScene(sceneId);
    setError("");
    setIsRendering(true);
    setProgress(0);
    setStage("Starting render...");

    const payload = {
      balance_Start: Number(inputs.balance_Start),
      growth_Rate: Number(inputs.growth_Rate),
      tax_Rate: Number(inputs.tax_Rate),
      year_Birth_Owner: Number(inputs.year_Birth_Owner),
      year_Birth_Beny: Number(inputs.year_Birth_Beny),
      date_Death_Owner: inputs.date_Death_Owner,
      scenario: inputs.scenario,
      plan: inputs.plan,
    };

    try {
      const response = await generateProjection(
        inputs.scenario,
        payload,
        sceneId,
        ({ progress, stage }) => {
          setProgress(progress);
          setStage(stage);
        },
      );

      setVideoUrl(`${API_BASE}${response.video_url}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Render failed. Please try again.");
    } finally {
      setIsRendering(false);
    }
  };

  return { generate, videoUrl, isRendering, progress, stage, error, scene };
}
