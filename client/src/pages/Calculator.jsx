/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useRenderMode } from "../context/RenderModeContext";
import useRmd from "../hooks/useRmd";

import Header from "../components/Header";
import InputForm from "../components/InputForm";
import WaterfallChart from "../components/WaterfallChart";
import AdvancedChart from "../components/AdvancedChart";
import DataTable from "../components/DataTable";

import ErrorBoundary from "../components/ErrorBoundary";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { generateProjection } from "../services/pythonapi";

import { Activity, Waves, Table2 } from "lucide-react";

const Calculator = () => {
  // =====================================================
  // DISPLAY STATES
  // =====================================================
  const { inputs } = useRmd();

  const [showChart, setShowChart] = useState(true);

  const [showTable, setShowTable] = useState(false);

  const [showGrowth, setShowGrowth] = useState(false);

  const [showTax, setShowTax] = useState(true);
  const { renderMode } = useRenderMode();

  const [videoUrl, setVideoUrl] = useState("");

  const [isRendering, setIsRendering] = useState(false);

  const [renderProgress, setRenderProgress] = useState(0);

  const [renderStage, setRenderStage] = useState("");

  const [sceneDialogOpen, setSceneDialogOpen] = useState(false);

  const [sceneType, setSceneType] = useState("projection");

  const generateCinematic = async (selectedScene) => {
    try {
      const deathRequiredScenarios = [
        "DECEASED_SPOUSE_INHERIT",

        "DECEASED_EDB_SINGLELIFE",

        "DECEASED_10YEAR",

        "DECEASED_10YEAR_ANNUAL",
      ];

      if (
        deathRequiredScenarios.includes(inputs.scenario.value) &&
        !inputs.date_Death_Owner
      ) {
        alert("Date of Death is required for this scenario.");

        return;
      }
      setIsRendering(true);
      setRenderProgress(0);
      setRenderStage("Starting render...");

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
      console.log(payload);

      const response = await generateProjection(
        inputs.scenario,
        payload,
        selectedScene,
        ({ progress, stage }) => {
          setRenderProgress(progress);
          setRenderStage(stage);
        },
      );

     const fullVideoUrl = `https://lackner-rmd.vercel.app/api${response.video_url}`;
      // const fullVideoUrl = `https://python-backend-rmd.onrender.com${response.video_url}`;

      setVideoUrl(fullVideoUrl);

      console.log(inputs.scenario);
      console.log(typeof inputs.scenario);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden

        bg-[var(--bg-primary)]

        transition-colors
        duration-300
      "
    >
      {/* =================================================
          BACKGROUND GLOWS
      ================================================= */}

      <div
        className="
          fixed
          top-[-220px]
          right-[-180px]

          w-[420px]
          h-[420px]

          rounded-full

          bg-purple-500/10

          blur-3xl

          pointer-events-none

          z-0
        "
      />

      <div
        className="
          fixed
          bottom-[-220px]
          left-[20%]

          w-[380px]
          h-[380px]

          rounded-full

          bg-purple-500/10

          blur-3xl

          pointer-events-none

          z-0
        "
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <div
        className="
          relative
          z-10
        "
      >
        {/* HEADER */}

        <Header />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            w-full
            max-w-[1800px]
            mx-auto

            p-3
            lg:p-4
            xl:p-5
          "
        >
          {/* =============================================
              GRID
          ============================================= */}

          <div
            className="
              grid

              md:grid-cols-[380px_minmax(0,1fr)]

              gap-4
              xl:gap-5

              items-start
            "
          >
            {/* =========================================
                LEFT FORM
            ========================================= */}

            <div
              className="
                self-start
                min-w-0
              "
            >
              <InputForm
                showChart={showChart}
                setShowChart={setShowChart}
                showTable={showTable}
                setShowTable={setShowTable}
                showGrowth={showGrowth}
                setShowGrowth={setShowGrowth}
                showTax={showTax}
                setShowTax={setShowTax}
              />
            </div>

            {/* =========================================
                RIGHT ANALYTICS
            ========================================= */}

            <div
              className="
                space-y-5
                min-w-0
                w-full
              "
            >
              {/* =====================================
                  PROJECTION ANALYTICS
              ===================================== */}

              {showChart && (
                <section className="space-y-3">
                  {/* HEADER */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        w-10
                        h-10

                        rounded-2xl

                        flex
                        items-center
                        justify-center

                        bg-gradient-to-br
                        from-purple-400
                        to-indigo-600

                        shadow-[0_0_25px_rgba(168,85,247,0.25)]
                      "
                    >
                      <Activity size={18} className="text-white" />
                    </div>

                    <div>
                      <h2
                        className="
                          text-lg
                          xl:text-xl

                          font-black

                          text-[var(--text-primary)]
                        "
                      >
                        Projection Analytics
                      </h2>

                      <p
                        className="
                          text-xs
                          xl:text-sm

                          text-[var(--text-secondary)]
                        "
                      >
                        Interactive 3D visualization and financial modeling
                      </p>
                    </div>
                  </div>

                  {/* CHART */}

                  {/* CHART */}

                  {renderMode === "node" ? (
                    <ErrorBoundary>
                      <AdvancedChart />
                   </ErrorBoundary>
                  ) : (
                    <div
                      className="
      relative

      w-full

      min-h-[500px]
      xl:min-h-[700px]

      rounded-3xl
      overflow-hidden

      border
      border-purple-500/20

      bg-black

      flex
      items-center
      justify-center
    "
                    >
                      <button
                        onClick={() => setSceneDialogOpen(true)}
                        className="
        absolute
        top-4
        right-4
        z-20

        px-5
        py-2

        rounded-xl

        bg-gradient-to-r
            from-purple-400
            to-indigo-500

            text-white

            shadow-[0_0_20px_rgba(168,85,247,0.35)]
          `
          : `
            text-[var(--text-secondary)]

            hover:text-white

        transition-all
      "
                      >
                        Generate Manim Analytics
                      </button>

                      {/* LOADING */}

                      {isRendering && (
                        <div
                          className="
          absolute
          inset-0
          z-20

          flex
          flex-col
          items-center
          justify-center

          px-10

          bg-black/90
          backdrop-blur-md
        "
                        >
                          {/* PERCENT RING */}
                          <div className="relative w-24 h-24">
                            <svg
                              className="w-24 h-24 -rotate-90"
                              viewBox="0 0 100 100"
                            >
                              <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                strokeWidth="8"
                                className="stroke-purple-500/20"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                strokeWidth="8"
                                strokeLinecap="round"
                                className="stroke-purple-400"
                                style={{
                                  strokeDasharray: 2 * Math.PI * 42,
                                  strokeDashoffset:
                                    2 *
                                    Math.PI *
                                    42 *
                                    (1 - renderProgress / 100),
                                  transition:
                                    "stroke-dashoffset 0.4s ease",
                                }}
                              />
                            </svg>

                            <div
                              className="
                                absolute
                                inset-0

                                flex
                                items-center
                                justify-center

                                text-white
                                text-xl
                                font-bold
                              "
                            >
                              {Math.round(renderProgress)}%
                            </div>
                          </div>

                          {/* LINEAR BAR */}
                          <div
                            className="
                              mt-6
                              w-full
                              max-w-xs

                              h-2

                              rounded-full

                              bg-purple-500/15

                              overflow-hidden
                            "
                          >
                            <div
                              className="
                                h-full

                                rounded-full

                                bg-gradient-to-r
                                from-purple-400
                                to-indigo-400
                              "
                              style={{
                                width: `${renderProgress}%`,
                                transition: "width 0.4s ease",
                              }}
                            />
                          </div>

                          <p
                            className="
            mt-4

            text-purple-300

            text-sm
            font-semibold
          "
                          >
                            {renderStage || "Rendering Manim Analytics..."}
                          </p>
                        </div>
                      )}

                      {/* VIDEO */}

                      {videoUrl && (
                        <video
                          key={videoUrl}
                          controls
                          autoPlay
                          preload="auto"
                          className="
    w-full
    h-full

    object-cover

    rounded-b-3xl

    bg-black
  "
                        >
                          <source src={videoUrl} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  )}
                </section>
              )}

              {/* =====================================
                  WATERFALL
              ===================================== */}

              {showChart && (
                <section className="space-y-3">
                  {/* HEADER */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        w-10
                        h-10

                        rounded-2xl

                        flex
                        items-center
                        justify-center

                        bg-gradient-to-br
                        from-violet-500
                        to-fuchsia-600

                        shadow-[0_0_25px_rgba(168,85,247,0.25)]
                      "
                    >
                      <Waves size={18} className="text-white" />
                    </div>

                    <div>
                      <h2
                        className="
                          text-lg
                          xl:text-xl

                          font-black

                          text-[var(--text-primary)]
                        "
                      >
                        Wealth Waterfall
                      </h2>

                      <p
                        className="
                          text-xs
                          xl:text-sm

                          text-[var(--text-secondary)]
                        "
                      >
                        Cinematic financial flow visualization
                      </p>
                    </div>
                  </div>

                  {/* WATERFALL */}

                  <WaterfallChart />
                </section>
              )}
            </div>
          </div>

          {/* =====================================
              FULL WIDTH TABLE
          ===================================== */}

          {showTable && (
            <section className="space-y-3 mt-8">
              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    w-10
                    h-10

                    rounded-2xl

                    flex
                    items-center
                    justify-center

                    bg-gradient-to-br
                    from-emerald-500
                    to-green-600

                    shadow-[0_0_25px_rgba(34,197,94,0.25)]
                  "
                >
                  <Table2 size={18} className="text-white" />
                </div>

                <div>
                  <h2
                    className="
                      text-lg
                      xl:text-xl

                      font-black

                      text-[var(--text-primary)]
                    "
                  >
                    Projection Table
                  </h2>

                  <p
                    className="
                      text-xs
                      xl:text-sm

                      text-[var(--text-secondary)]
                    "
                  >
                    Detailed yearly analytics
                  </p>
                </div>
              </div>

              {/* TABLE */}

              <DataTable />
            </section>
          )}
        </div>
      </div>
      <Dialog open={sceneDialogOpen} onClose={() => setSceneDialogOpen(false)}>
        <DialogTitle>Select Analytics Video</DialogTitle>

        <DialogContent>
          <div className="flex flex-col gap-3 pt-2">
            <button
              className="px-4 py-3 rounded-xl bg-cyan-500 text-white"
              onClick={() => {
                setSceneType("projection");

                setSceneDialogOpen(false);

                generateCinematic("projection");
              }}
            >
              Projection Analysis
            </button>

            <button
              className="px-4 py-3 rounded-xl bg-purple-500 text-white"
              onClick={() => {
                setSceneType("rmd");

                setSceneDialogOpen(false);

                generateCinematic("rmd");
              }}
            >
              RMD Analysis
            </button>

            <button
              className="px-4 py-3 rounded-xl bg-red-500 text-white"
              onClick={() => {
                setSceneType("tax");

                setSceneDialogOpen(false);

                generateCinematic("tax");
              }}
            >
              Tax Analysis
            </button>

            <button
              className="px-4 py-3 rounded-xl bg-orange-500 text-white"
              onClick={() => {
                setSceneType("collapse");

                setSceneDialogOpen(false);

                generateCinematic("collapse");
              }}
            >
              Collapse Analysis
            </button>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSceneDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Calculator;
