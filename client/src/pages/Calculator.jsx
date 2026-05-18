import { useState } from "react";

import Header from "../components/Header";
import InputForm from "../components/InputForm";
import WaterfallChart from "../components/WaterfallChart";
import AdvancedChart from "../components/AdvancedChart";
import DataTable from "../components/DataTable";

import { Activity, Waves, Table2 } from "lucide-react";

const Calculator = () => {
  // =====================================================
  // DISPLAY STATES
  // =====================================================

  const [showChart, setShowChart] = useState(true);

  const [showTable, setShowTable] = useState(false);

  const [showGrowth, setShowGrowth] = useState(false);

  const [showTax, setShowTax] = useState(true);

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

          bg-cyan-500/10

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

              md:grid-cols-[300px_minmax(0,1fr)]

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
                        from-cyan-400
                        to-blue-600

                        shadow-[0_0_25px_rgba(0,212,255,0.25)]
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

                  <AdvancedChart />
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
    </div>
  );
};

export default Calculator;
