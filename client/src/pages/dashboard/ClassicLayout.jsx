import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useRenderMode } from "../../context/RenderModeContext";
import useRmd from "../../hooks/useRmd";

import SummaryCards from "../../components/SummaryCards";
import InputForm from "../../components/InputForm";
import WaterfallChart from "../../components/WaterfallChart";
import AdvancedChart from "../../components/AdvancedChart";
import DataTable from "../../components/DataTable";

import ErrorBoundary from "../../components/ErrorBoundary";
import { EngineToggle } from "../../components/dashboard/InputSections";
import CinematicPanel from "../../components/dashboard/CinematicPanel";

import { scrollToSection } from "../../utils/scroll";

import {
  Activity,
  Waves,
  Table2,
  BadgeDollarSign,
  ArrowDown,
} from "lucide-react";

// Icon + plain-language heading used by every results section. Headings are
// focusable (tabIndex -1) so "Calculate" can hand screen-reader focus to them.
const SectionHeading = ({ icon: Icon, accent, glow, title, subtitle, headingRef }) => (
  <div
    className="
      flex
      items-center
      gap-3
    "
  >
    <div
      className={`
        w-11
        h-11
        shrink-0

        rounded-2xl

        flex
        items-center
        justify-center

        bg-gradient-to-br
        ${accent}

        ${glow}
      `}
    >
      <Icon size={20} className="text-white" />
    </div>

    <div className="min-w-0">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="
          text-xl
          xl:text-2xl

          leading-tight
          font-black
          tracking-tight

          text-[var(--text-primary)]
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-0.5

          text-sm
          sm:text-base

          text-[var(--text-secondary)]
        "
      >
        {subtitle}
      </p>
    </div>
  </div>
);

// The original dashboard the client likes, rendered inside the shared
// dashboard shell (navbar) like the other layouts. Inputs stay sticky on the
// left on wide screens and stack above the results on phones/tablets; the
// summary cards sit at the top of the analytics column.
const ClassicLayout = () => {
  // =====================================================
  // DISPLAY STATES
  // =====================================================
  const { result } = useRmd();

  const [showChart, setShowChart] = useState(true);

  const [showTable, setShowTable] = useState(false);

  const [showGrowth, setShowGrowth] = useState(false);

  const [showTax, setShowTax] = useState(true);
  const { renderMode } = useRenderMode();

  // Manim render state is shared with Workspace/Planner via the shell
  const { cinematic } = useOutletContext();

  // =====================================================
  // CALCULATE → SCROLL TO RESULTS
  // Results recalculate live (RmdContext); the Calculate
  // buttons take the reader to the graphs.
  // =====================================================
  const resultsRef = useRef(null);
  const resultsHeadingRef = useRef(null);

  const chartsRef = useRef(null);
  const chartsHeadingRef = useRef(null);

  const calculateRef = useRef(null);

  const [showJumpBar, setShowJumpBar] = useState(false);

  const scrollToResults = () => {
    if (showChart && chartsRef.current) {
      scrollToSection(chartsRef.current, chartsHeadingRef.current);
    } else {
      scrollToSection(resultsRef.current, resultsHeadingRef.current);
    }
  };

  // Phones/tablets: a sticky "Calculate" bar while the reader is in the form,
  // hidden once the form's own button or the results are on screen.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const seen = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target, e.isIntersecting));
        setShowJumpBar(![...seen.values()].some(Boolean));
      },
      // ignore the strip the bar itself covers
      { rootMargin: "0px 0px -96px 0px" },
    );

    [calculateRef.current, resultsRef.current].forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* =============================================
          GRID — sticky inputs left, analytics right
          (stacked below lg)
      ============================================= */}

      <div
        className="
          grid

          lg:grid-cols-[380px_minmax(0,1fr)]

          gap-6
          lg:gap-4
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

                lg:sticky
                lg:top-[4.75rem]
                lg:max-h-[calc(100vh_/_var(--app-zoom,1)_-_6rem)]
                lg:overflow-y-auto
                lg:overscroll-contain

                rounded-[var(--card-radius)]

                print:static
                print:max-h-none
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
                onCalculate={scrollToResults}
                calculateRef={calculateRef}
              />
            </div>

            {/* =========================================
                RIGHT ANALYTICS
            ========================================= */}

            <div
              ref={resultsRef}
              className="
                space-y-6
                lg:space-y-5
                min-w-0
                w-full

                scroll-mt-[5rem]
              "
            >
              {/* =====================================
                  SUMMARY CARDS
              ===================================== */}

              <section className="space-y-3">
                <SectionHeading
                  icon={BadgeDollarSign}
                  accent="from-purple-500 to-indigo-600"
                  glow="shadow-[0_0_25px_rgba(124,58,237,0.25)]"
                  title="Your Results"
                  subtitle="The totals for this scenario at a glance"
                  headingRef={resultsHeadingRef}
                />

                <SummaryCards />
              </section>

              {/* chart engine lives in the navbar on wide screens */}
              <EngineToggle className="max-w-xs lg:hidden" />

              {/* =====================================
                  PROJECTION ANALYTICS
              ===================================== */}

              {showChart && (
                <section ref={chartsRef} className="space-y-3 scroll-mt-[5rem]">
                  {/* HEADER */}

                  <SectionHeading
                    icon={Activity}
                    accent="from-purple-400 to-indigo-600"
                    glow="shadow-[0_0_25px_rgba(168,85,247,0.25)]"
                    title="Projection Analytics"
                    subtitle="How your balance, withdrawals and taxes change each year"
                    headingRef={chartsHeadingRef}
                  />

                  {/* CHART */}

                  {/* Interactive 3D charts, or the same four Manim videos as
                      Workspace (render state lives in the dashboard shell) */}
                  {renderMode === "node" ? (
                    <ErrorBoundary>
                      <AdvancedChart />
                    </ErrorBoundary>
                  ) : (
                    <CinematicPanel cinematic={cinematic} />
                  )}
                </section>
              )}

              {/* =====================================
                  WATERFALL
              ===================================== */}

              {showChart && (
                <section className="space-y-3">
                  {/* HEADER */}

                  <SectionHeading
                    icon={Waves}
                    accent="from-violet-500 to-fuchsia-600"
                    glow="shadow-[0_0_25px_rgba(168,85,247,0.25)]"
                    title="Wealth Waterfall"
                    subtitle="Where your money goes, year by year"
                  />

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

              <SectionHeading
                icon={Table2}
                accent="from-emerald-500 to-green-600"
                glow="shadow-[0_0_25px_rgba(34,197,94,0.25)]"
                title="Projection Table"
                subtitle="Every year's withdrawal, tax and ending balance"
              />

              {/* TABLE */}

              <DataTable />
            </section>
          )}

      {/* =============================================
          STICKY CALCULATE BAR — phones/tablets only
      ============================================= */}

      <div
        inert={!showJumpBar}
        className={`
          fixed
          inset-x-0
          bottom-0
          z-30

          px-4
          pt-3
          pb-[max(0.75rem,env(safe-area-inset-bottom))]

          border-t
          border-[var(--border-color)]
          bg-[var(--glass-bg)]
          backdrop-blur-2xl
          shadow-[0_-10px_30px_rgba(15,23,42,0.12)]

          transition-[transform,opacity]
          duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]
          motion-reduce:transition-none

          lg:hidden
          print:hidden

          ${showJumpBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"}
        `}
      >
        <button
          type="button"
          onClick={scrollToResults}
          aria-label="Calculate and show results"
          className="
            mx-auto
            flex
            w-full
            max-w-xl
            min-h-[3.5rem]
            items-center
            justify-center
            gap-3

            rounded-2xl

            bg-gradient-to-r
            from-purple-600
            via-violet-600
            to-indigo-600

            px-6

            text-lg
            font-extrabold
            text-white

            shadow-[0_8px_24px_rgba(124,58,237,0.4)]

            active:scale-[0.99]
          "
        >
          Calculate
          {result && (
            <span className="font-semibold text-white/85 text-base">
              · see results
            </span>
          )}
          <ArrowDown size={22} aria-hidden />
        </button>
      </div>

    </div>
  );
};

export default ClassicLayout;
