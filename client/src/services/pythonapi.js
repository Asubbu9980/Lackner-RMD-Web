const API_BASE = //"http://localhost:8000";
"https://python-backend-rmd.onrender.com";

export const generateProjection = async (
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
      throw new Error("Failed to generate cinematic");
    }

    return await response.json();
  } catch (error) {
    console.error(error);

    throw error;
  }
};
