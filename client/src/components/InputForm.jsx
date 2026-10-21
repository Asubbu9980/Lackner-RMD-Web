import {
  Calculator,
  SlidersHorizontal,
  ChevronDown,
  FileOutput,
  Printer,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowDown,
  LoaderCircle,
  LineChart,
  Table2,
  TrendingUp,
  Landmark,
} from "lucide-react";

import useRmd from "../hooks/useRmd";
import FluidSlider from "./dashboard/FluidSlider";

const scenarios = [
  {
    id: "LIVING_UNIFORM",
    label:
      "Chart 01 · Uniform Lifetime",
  },
  {
    id: "LIVING_JOINT",
    label:
      "Chart 00 · Spouse >10y Younger",
  },
  {
    id:
      "DECEASED_SPOUSE_INHERIT",
    label:
      "Chart 03 · Spouse Inherited",
  },
  {
    id:
      "DECEASED_EDB_SINGLELIFE",
    label:
      "Chart 05 · Non-Spouse EDB",
  },
  {
    id: "DECEASED_10YEAR",
    label:
      "Chart 11 · 10-Year Rule",
  },
  {
    id:
      "DECEASED_10YEAR_ANNUAL",
    label:
      "Chart 12 · 10-Year + Annual",
  },
];

// Readable, sentence-case field labels (the uppercase micro-labels were hard
// to read for older eyes)
const labelClass = `
  block

  text-sm
  font-semibold

  text-[var(--text-primary)]

  mb-2
`;

// "Age 73" beside a birth-year label; hidden until the year is a real one
const AgeTag = ({ year }) => {
  const thisYear = new Date().getFullYear();
  const valid = Number.isInteger(year) && year >= 1900 && year <= thisYear;

  if (!valid) return null;

  return (
    <span
      title={`Age reached in ${thisYear}`}
      className="
        shrink-0
        rounded-full
        bg-purple-500/10
        px-2.5
        py-0.5
        text-sm
        font-bold
        tabular-nums
        text-purple-700
        dark:text-purple-200
      "
    >
      Age {thisYear - year}
    </span>
  );
};

const inputClass = `
  w-full
  min-h-[3rem]

  rounded-2xl

  border
  border-[var(--border-color)]

  bg-[var(--bg-secondary)]

  px-4
  py-3

  text-base
  font-semibold
  tabular-nums
  text-[var(--text-primary)]

  outline-none

  transition-[border-color,box-shadow]
  duration-300

  focus:border-purple-400
  focus:ring-4
  focus:ring-purple-400/20

  hover:border-purple-400/40
`;

const secondaryButton = `
  flex
  min-h-[3rem]
  flex-1
  basis-[6rem]
  items-center
  justify-center
  gap-2

  px-3
  py-2.5

  rounded-2xl

  border
  border-[var(--border-color)]

  bg-[var(--bg-secondary)]

  text-[var(--text-primary)]
  text-sm
  font-semibold
  whitespace-nowrap

  hover:bg-[var(--hover-bg)]
  hover:border-purple-400/40

  transition-colors
  duration-300
`;

const InputForm = ({
  showChart,
  setShowChart,

  showTable,
  setShowTable,

  showGrowth,
  setShowGrowth,

  showTax,
  setShowTax,

  // scrolls to the results; set by ClassicLayout
  onCalculate,

  // lets the layout know when this button is on screen (sticky bar)
  calculateRef,
}) => {
  const { inputs, setInputs, calculating } =
    useRmd();

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setInputs({
      ...inputs,

      [name]:
        name.includes("date")
          ? value
          : Number(value),
    });
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const dataStr =
      JSON.stringify(
        inputs,
        null,
        2
      );

    const blob = new Blob(
      [dataStr],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;
    a.download =
      "rmd-data.json";

    a.click();
  };

  return (
    <div
      className="
        relative

        overflow-hidden

        rounded-[var(--card-radius)]

        border
        border-[var(--border-color)]

        bg-[var(--glass-bg)]

        backdrop-blur-2xl

        shadow-[0_20px_60px_rgba(0,0,0,0.18)]

        p-4
        sm:p-5

        transition-colors
        duration-300
      "
    >
      {/* =====================================
          BACKGROUND GLOW
      ===================================== */}

      <div
        className="
          absolute
          top-[-100px]
          right-[-60px]

          w-[220px]
          h-[220px]

          rounded-full

          bg-purple-500/10

          blur-3xl

          pointer-events-none
        "
      />

      {/* =====================================
          HEADER
      ===================================== */}

      <div
        className="
          relative
          z-10

          flex
          items-center
          justify-between
          gap-3

          mb-6
        "
      >
        <div className="min-w-0">
          <div
            className="
              inline-flex
              items-center
              gap-2

              px-3
              py-1

              rounded-full

              bg-purple-400/10

              border
              border-purple-400/20

              mb-3
            "
          >
            <Sparkles
              size={14}
              className="text-purple-600 dark:text-purple-300"
            />

            <span
              className="
                text-xs
                uppercase
                tracking-[0.16em]

                text-purple-700
                dark:text-purple-300
                font-bold
              "
            >
              Step 1 · Your details
            </span>
          </div>

          <h3
            className="
              text-2xl
              font-black
              tracking-tight

              text-[var(--text-primary)]
            "
          >
            Input Parameters
          </h3>

          <p
            className="
              text-base
              leading-snug
              text-[var(--text-secondary)]

              mt-1
            "
          >
            Enter your account and
            family details, then tap
            Calculate to see your
            results.
          </p>
        </div>

        <div
          className="
            hidden
            xl:flex

            shrink-0
            items-center
            justify-center

            w-14
            h-14

            rounded-2xl

            bg-gradient-to-br
            from-purple-400
            to-indigo-600

            shadow-[0_0_30px_rgba(168,85,247,0.3)]
          "
        >
          <Calculator
            size={24}
            className="text-white"
          />
        </div>
      </div>

      {/* =====================================
          FORM
      ===================================== */}

      <div className="relative z-10 space-y-7">
        {/* =================================
            FINANCIAL INPUTS
        ================================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2

            items-end

            gap-x-4
            gap-y-5
          "
        >
          {/* START BALANCE */}

          <div className="sm:col-span-2">
            <label
              htmlFor="classic_balance_Start"
              className={labelClass}
            >
              Starting balance
            </label>

            <div className="relative">
              <span
                aria-hidden
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  text-base
                  font-bold
                  text-[var(--text-secondary)]
                "
              >
                $
              </span>

              <input
                id="classic_balance_Start"
                name="balance_Start"
                inputMode="decimal"
                autoComplete="off"
                value={
                  inputs.balance_Start
                }
                onChange={
                  handleChange
                }
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          {/* GROWTH */}

          <div className="sm:col-span-2">
            <label
              htmlFor="classic_growth_Rate"
              className={labelClass}
            >
              Yearly growth rate
            </label>

            <FluidSlider
              id="classic_growth_Rate"
              ariaLabel="growth rate"
              tone="growth"
              min={-5}
              max={15}
              step={0.5}
              marks={[4, 6, 8]}
              value={inputs.growth_Rate}
              onChange={(v) =>
                setInputs({
                  ...inputs,

                  growth_Rate: v,
                })
              }
            />
          </div>

          {/* TAX */}

          <div className="sm:col-span-2">
            <label
              htmlFor="classic_tax_Rate"
              className={labelClass}
            >
              Tax rate on withdrawals
            </label>

            <FluidSlider
              id="classic_tax_Rate"
              ariaLabel="tax rate"
              tone="tax"
              min={0}
              max={50}
              step={1}
              marks={[12, 22, 24, 32, 35, 37]}
              value={inputs.tax_Rate}
              onChange={(v) =>
                setInputs({
                  ...inputs,

                  tax_Rate: v,
                })
              }
            />
          </div>

          {/* OWNER */}

          <div>
            <label
              htmlFor="classic_year_Birth_Owner"
              className={`${labelClass} flex items-baseline justify-between gap-2`}
            >
              Owner birth year
              <AgeTag year={inputs.year_Birth_Owner} />
            </label>

            <input
              id="classic_year_Birth_Owner"
              name="year_Birth_Owner"
              inputMode="numeric"
              autoComplete="off"
              value={
                inputs.year_Birth_Owner
              }
              onChange={
                handleChange
              }
              className={
                inputClass
              }
            />
          </div>

          {/* BENEFICIARY */}

          <div>
            <label
              htmlFor="classic_year_Birth_Beny"
              className={`${labelClass} flex items-baseline justify-between gap-2`}
            >
              Beneficiary birth year
              <AgeTag year={inputs.year_Birth_Beny} />
            </label>

            <input
              id="classic_year_Birth_Beny"
              name="year_Birth_Beny"
              inputMode="numeric"
              autoComplete="off"
              value={
                inputs.year_Birth_Beny
              }
              onChange={
                handleChange
              }
              className={
                inputClass
              }
            />
          </div>

          {/* DATE */}

          <div>
            <label
              htmlFor="classic_date_Death_Owner"
              className={labelClass}
            >
              Owner date of death
              <span className="ml-1 font-normal text-[var(--text-secondary)]">
                (if inherited)
              </span>
            </label>

            <input
              id="classic_date_Death_Owner"
              type="date"
              name="date_Death_Owner"
              value={
                inputs.date_Death_Owner
              }
              onChange={(
                e
              ) =>
                setInputs({
                  ...inputs,

                  date_Death_Owner:
                    e.target.value,
                })
              }
              className={
                inputClass
              }
            />
          </div>

          {/* PLAN */}

          <div>
            <label
              htmlFor="classic_plan"
              className={labelClass}
            >
              Plan type
            </label>

            <div className="relative">
              <select
                id="classic_plan"
                value={
                  inputs.plan
                }
                onChange={(
                  e
                ) =>
                  setInputs({
                    ...inputs,
  
                    plan:
                      e.target.value,
                  })
                }
                className={`${inputClass} cursor-pointer appearance-none pr-11`}
              >
                <option value="IRA">
                  Traditional IRA
                </option>
  
                <option value="401k">
                  401(k)
                </option>
  
                <option value="Roth">
                  Roth IRA
                </option>
              </select>
  
              {/* own chevron — the native one sits at a different inset per browser */}
              <ChevronDown
                size={20}
                aria-hidden
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              />
            </div>
          </div>
        </div>

        {/* =================================
            SCENARIOS
        ================================= */}

        <div>
          <div
            className="
              flex
              items-center
              gap-2

              mb-3
            "
          >
            <SlidersHorizontal
              size={18}
              className="text-purple-600 dark:text-purple-300"
            />

            <h4
              className="
                text-base
                font-bold

                text-[var(--text-primary)]
              "
            >
              Which situation applies?
            </h4>
          </div>

          {/* pills — label is "Chart 01 · Uniform Lifetime"; full-width rows on phones */}
          <div
            role="radiogroup"
            aria-label="Scenario"
            className="
              grid
              grid-cols-1
              min-[480px]:grid-cols-2
              lg:flex
              lg:flex-wrap

              gap-2
            "
          >
            {scenarios.map((s) => {
              const [chart, title] = s.label.split(" · ");
              const active = inputs.scenario === s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={s.label}
                  onClick={() =>
                    setInputs({
                      ...inputs,

                      scenario: s.id,
                    })
                  }
                  className={`
                    flex
                    min-h-[2.75rem]
                    items-center
                    gap-2

                    rounded-full

                    border

                    py-1.5
                    pl-1.5
                    pr-3.5

                    text-left
                    text-sm
                    font-semibold

                    transition-[background-color,border-color,color,box-shadow,transform]
                    duration-300

                    hover:transform-none
                    active:scale-[0.97]

                    ${
                      active
                        ? `
                          border-purple-400/70

                          bg-gradient-to-r
                          from-purple-500/20
                          to-indigo-500/15

                          shadow-[0_0_18px_rgba(168,85,247,0.18)]

                          text-[var(--text-primary)]
                        `
                        : `
                          border-[var(--border-color)]

                          bg-[var(--bg-secondary)]

                          text-[var(--text-secondary)]

                          hover:border-purple-400/40
                          hover:text-[var(--text-primary)]
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      shrink-0

                      rounded-full

                      px-2
                      py-0.5

                      text-xs
                      font-bold
                      tabular-nums

                      transition-colors
                      duration-300

                      ${
                        active
                          ? "bg-purple-600 text-white"
                          : "bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                      }
                    `}
                  >
                    {chart.replace("Chart ", "")}
                  </span>

                  <span className="min-w-0 flex-1">
                    {title}
                  </span>

                  {active && (
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-purple-600 dark:text-purple-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================
            DISPLAY
        ================================= */}

        <fieldset
          className="
            rounded-[var(--card-radius)]

            border
            border-[var(--border-color)]

            bg-[var(--bg-secondary)]

            p-4
            sm:p-5
          "
        >
          <legend
            className="
              px-1

              text-base
              font-bold

              text-[var(--text-primary)]
            "
          >
            What to show
          </legend>

          <div
            className="
              grid
              grid-cols-2

              gap-2
              sm:gap-3
            "
          >
            {[
              {
                label:
                  "Charts",
                icon:
                  LineChart,
                checked:
                  showChart,

                action:
                  setShowChart,
              },

              {
                label:
                  "Table",
                icon:
                  Table2,
                checked:
                  showTable,

                action:
                  setShowTable,
              },

              {
                label:
                  "Growth",
                icon:
                  TrendingUp,
                checked:
                  showGrowth,

                action:
                  setShowGrowth,
              },

              {
                label:
                  "Tax",
                icon:
                  Landmark,
                checked:
                  showTax,

                action:
                  setShowTax,
              },
            ].map(
              (
                item
              ) => {
                const Icon = item.icon;

                // whole tile is the tap target
                return (
                  <label
                    key={item.label}
                    className={`
                      flex
                      min-h-[3rem]
                      items-center
                      gap-3

                      rounded-2xl

                      border

                      px-3
                      py-2

                      cursor-pointer
                      select-none

                      transition-colors
                      duration-300

                      has-[:focus-visible]:outline
                      has-[:focus-visible]:outline-[3px]
                      has-[:focus-visible]:outline-purple-500
                      has-[:focus-visible]:outline-offset-2

                      ${
                        item.checked
                          ? "border-purple-400/60 bg-purple-500/10"
                          : "border-[var(--border-color)] hover:bg-[var(--hover-bg)]"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={
                        item.checked
                      }
                      onChange={() =>
                        item.action(
                          !item.checked
                        )
                      }
                      className="
                        accent-purple-600
                        w-5
                        h-5
                        shrink-0
                        cursor-pointer
                      "
                    />

                    <Icon
                      size={18}
                      aria-hidden
                      className={`shrink-0 ${item.checked ? "text-purple-600 dark:text-purple-300" : "text-[var(--text-secondary)]"}`}
                    />

                    <span
                      className="
                        text-base
                        font-semibold
                        text-[var(--text-primary)]
                      "
                    >
                      {item.label}
                    </span>
                  </label>
                );
              }
            )}
          </div>
        </fieldset>

        {/* =================================
            ACTIONS
        ================================= */}

        <div className="space-y-3 pt-1">
          {/* CALCULATE — results update live; this takes the reader to them */}

          <button
            ref={calculateRef}
            type="button"
            onClick={onCalculate}
            aria-describedby="classic-calc-hint"
            className="
              group
              relative

              flex
              w-full
              min-h-[3.75rem]
              items-center
              justify-center
              gap-3

              overflow-hidden

              px-6
              py-4

              rounded-2xl

              bg-gradient-to-r
              from-purple-600
              via-violet-600
              to-indigo-600

              text-white
              text-lg
              font-extrabold
              tracking-tight

              shadow-[0_10px_30px_rgba(124,58,237,0.35)]

              transition-[transform,box-shadow]
              duration-300

              hover:-translate-y-0.5
              hover:shadow-[0_14px_40px_rgba(124,58,237,0.45)]

              active:translate-y-0
              active:scale-[0.99]
            "
          >
            {/* soft sheen */}
            <span
              aria-hidden
              className="
                pointer-events-none
                absolute
                inset-0

                bg-gradient-to-b
                from-white/15
                to-transparent
              "
            />

            {calculating ? (
              <LoaderCircle
                size={24}
                aria-hidden
                className="relative animate-spin motion-reduce:animate-none"
              />
            ) : (
              <Calculator
                size={24}
                aria-hidden
                className="relative"
              />
            )}

            <span className="relative">
              {calculating ? "Calculating…" : "Calculate"}
            </span>

            <ArrowDown
              size={22}
              aria-hidden
              className="
                relative

                transition-transform
                duration-300

                group-hover:translate-y-0.5
                motion-reduce:transition-none
              "
            />
          </button>

          <p
            id="classic-calc-hint"
            className="
              text-center
              text-sm
              text-[var(--text-secondary)]
            "
          >
            Shows your results and charts
          </p>

          {/* SECONDARY */}

          <div
            className="
              flex
              flex-wrap

              gap-2
            "
          >
            <button
              type="button"
              onClick={
                handleReset
              }
              className={secondaryButton}
            >
              <RotateCcw
                size={18}
                aria-hidden
              />

              Reset
            </button>

            <button
              type="button"
              onClick={
                handlePrint
              }
              className={secondaryButton}
            >
              <Printer
                size={18}
                aria-hidden
              />

              Print
            </button>

            <button
              type="button"
              onClick={
                handleExport
              }
              aria-label="Export JSON"
              className={secondaryButton}
            >
              <FileOutput
                size={18}
                aria-hidden
              />

              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
