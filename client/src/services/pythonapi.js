const API_BASE =
  "http://localhost:8000";

export const generateProjection =
  async (
    scenario,
    payload
  ) => {

    try {

      const response =
        await fetch(

          `${API_BASE}/cinematic/${scenario}/projection`,

          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(payload),
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to generate cinematic"
        );
      }

      return await response.json();

    } catch (error) {

      console.error(error);

      throw error;
    }
};