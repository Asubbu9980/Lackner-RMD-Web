const API_BASE = "http://localhost:8000";
// const API_BASE = "https://python-backend-rmd.onrender.com";

// Start a cinematic render. Returns { job_id, summary, ... } immediately;
// the actual render runs on the backend and is tracked via job status.
export const startCinematic = async (
  scenario,
  payload,
  sceneType = "projection",
) => {
  try {
    const response = await fetch(
      `${API_BASE}/cinematic/${scenario}/${sceneType}`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to start cinematic render");
    }

    return await response.json();
  } catch (error) {
    console.error(error);

    throw error;
  }
};

// Fetch the current status of a render job:
// { status, progress, stage, video_url, summary, error }
export const getCinematicStatus = async (jobId) => {
  const response = await fetch(`${API_BASE}/cinematic/status/${jobId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch render status");
  }

  return await response.json();
};

// Start a render and resolve once it finishes, reporting real progress
// via onProgress({ progress, stage }) as the backend renders.
export const generateProjection = async (
  scenario,
  payload,
  sceneType = "projection",
  onProgress,
) => {
  const { job_id: jobId } = await startCinematic(
    scenario,
    payload,
    sceneType,
  );

  return await new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const status = await getCinematicStatus(jobId);

        if (onProgress) {
          onProgress({
            progress: status.progress ?? 0,
            stage: status.stage ?? "",
          });
        }

        if (status.status === "done") {
          resolve(status);
          return;
        }

        if (status.status === "error") {
          reject(new Error(status.error || "Render failed"));
          return;
        }

        setTimeout(poll, 600);
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
};
