/* eslint-disable no-unused-vars */
import { useState } from "react";

import {
  Calculator,
  SlidersHorizontal,
  FileOutput,
  Printer,
  RotateCcw,
  Sparkles,
  CheckCircle2,
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

const InputForm = ({
  showChart,
  setShowChart,

  showTable,
  setShowTable,

  showGrowth,
  setShowGrowth,

  showTax,
  setShowTax,
}) => {
  const { inputs, setInputs } =
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

  const inputClass = `
    w-full

    rounded-2xl

    border
    border-[var(--border-color)]

    bg-[var(--bg-secondary)]

    px-4
    py-3

    text-sm
    text-[var(--text-primary)]

    outline-none

    transition-all
    duration-300

    focus:border-purple-400
    focus:ring-4
    focus:ring-purple-400/10

    hover:border-purple-400/30
  `;

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

        p-5

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

          mb-6
        "
      >
        <div>
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
              className="text-purple-300"
            />

            <span
              className="
                text-[11px]
                uppercase
                tracking-[0.18em]

                text-purple-300
                font-semibold
              "
            >
              Configuration
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
              text-sm
              text-[var(--text-secondary)]

              mt-1
            "
          >
            Configure financial
            assumptions and
            projection scenarios
          </p>
        </div>

        <div
          className="
            hidden
            xl:flex

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

      <div className="relative z-10 space-y-6">
        {/* =================================
            FINANCIAL INPUTS
        ================================= */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2

            gap-4
          "
        >
          {/* START BALANCE */}

          <div className="md:col-span-2">
            <label
              className="
                block

                text-xs
                font-semibold

                uppercase
                tracking-[0.14em]

                text-[var(--text-secondary)]

                mb-2
              "
            >
              Starting Balance
            </label>

            <input
              name="balance_Start"
              value={
                inputs.balance_Start
              }
              onChange={
                handleChange
              }
              className={
                inputClass
              }
            />
          </div>

          {/* GROWTH */}

          <div className="md:col-span-2">
            <label
              htmlFor="classic_growth_Rate"
              className="
                block

                text-xs
                font-semibold

                uppercase
                tracking-[0.14em]

                text-[var(--text-secondary)]

                mb-1
              "
            >
              Growth Rate (%)
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

          <div className="md:col-span-2">
            <label
              htmlFor="classic_tax_Rate"
              className="
                block

                text-xs
                font-semibold

                uppercase
                tracking-[0.14em]

                text-[var(--text-secondary)]

                mb-1
              "
            >
              Tax Rate (%)
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
              className="
                block

                text-xs
                font-semibold

                uppercase
                tracking-[0.14em]

                text-[var(--text-secondary)]

                mb-2
              "
            >
              Owner Birth Year
            </label>

            <input
              name="year_Birth_Owner"
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
              className="
                block

                text-xs
                font-semibold

                uppercase
                tracking-[0.14em]

                text-[var(--text-secondary)]

                mb-2
              "
            >
              Beneficiary Birth Year
            </label>

            <input
              name="year_Birth_Beny"
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
              className="
                block

                text-xs
                font-semibold

                uppercase
                tracking-[0.14em]

                text-[var(--text-secondary)]

                mb-2
              "
            >
              Date of Death
            </label>

            <input
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
              className="
                block

                text-xs
                font-semibold

                uppercase
                tracking-[0.14em]

                text-[var(--text-secondary)]

                mb-2
              "
            >
              Plan Type
            </label>

            <select
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
              className={
                inputClass
              }
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

              mb-4
            "
          >
            <SlidersHorizontal
              size={16}
              className="text-purple-300"
            />

            <h4
              className="
                text-sm
                font-bold

                uppercase
                tracking-[0.14em]

                text-[var(--text-primary)]
              "
            >
              Scenario Selection
            </h4>
          </div>

          {/* compact pills — label is "Chart 01 · Uniform Lifetime" */}
          <div
            role="radiogroup"
            aria-label="Scenario"
            className="
              flex
              flex-wrap
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
                    inline-flex
                    items-center
                    gap-1.5

                    rounded-full

                    border

                    py-1.5
                    pl-1.5
                    pr-3

                    text-xs
                    font-semibold

                    transition-all
                    duration-300

                    hover:transform-none
                    active:scale-95

                    ${
                      active
                        ? `
                          border-purple-400/60

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
                      rounded-full

                      px-1.5
                      py-0.5

                      text-[10px]
                      font-bold
                      tabular-nums

                      transition-colors
                      duration-300

                      ${
                        active
                          ? "bg-purple-500 text-white"
                          : "bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                      }
                    `}
                  >
                    {chart.replace("Chart ", "")}
                  </span>

                  {title}

                  {active && (
                    <CheckCircle2
                      size={14}
                      className="text-purple-400"
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

        <div
          className="
            rounded-[var(--card-radius)]

            border
            border-[var(--border-color)]

            bg-[var(--bg-secondary)]

            p-5
          "
        >
          <h4
            className="
              text-sm
              font-bold

              uppercase
              tracking-[0.14em]

              text-[var(--text-primary)]

              mb-4
            "
          >
            Display Settings
          </h4>

          <div
            className="
              grid
              grid-cols-2

              gap-4
            "
          >
            {[
              {
                label:
                  "Chart",
                checked:
                  showChart,

                action:
                  setShowChart,
              },

              {
                label:
                  "Table",
                checked:
                  showTable,

                action:
                  setShowTable,
              },

              {
                label:
                  "Growth",
                checked:
                  showGrowth,

                action:
                  setShowGrowth,
              },

              {
                label:
                  "Tax",
                checked:
                  showTax,

                action:
                  setShowTax,
              },
            ].map(
              (
                item,
                i
              ) => (
                <label
                  key={i}
                  className="
                    flex
                    items-center
                    gap-3

                    cursor-pointer
                  "
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
                      accent-purple-500
                      w-4
                      h-4
                    "
                  />

                  <span
                    className="
                      text-sm
                      text-[var(--text-primary)]
                    "
                  >
                    {item.label}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* =================================
            ACTIONS
        ================================= */}

        <div
          className="
            flex
            flex-wrap

            gap-3

            pt-2
          "
        >
          {/* CALCULATE */}

          <button
            className="
              flex
              items-center
              gap-2

              px-5
              py-3

              rounded-2xl

              bg-gradient-to-r
              from-purple-500
              to-indigo-600

              text-white
              text-sm
              font-semibold

              shadow-[0_0_30px_rgba(168,85,247,0.25)]

              transition-all
              duration-300

              hover:-translate-y-[1px]
              hover:scale-[1.02]
            "
          >
            <Calculator
              size={16}
            />

            Calculate
          </button>

          {/* RESET */}

          <button
            onClick={
              handleReset
            }
            className="
              flex
              items-center
              gap-2

              px-5
              py-3

              rounded-2xl

              border
              border-[var(--border-color)]

              bg-[var(--bg-secondary)]

              text-[var(--text-primary)]
              text-sm
              font-medium

              hover:bg-[var(--hover-bg)]

              transition-all
              duration-300
            "
          >
            <RotateCcw
              size={16}
            />

            Reset
          </button>

          {/* PRINT */}

          <button
            onClick={
              handlePrint
            }
            className="
              flex
              items-center
              gap-2

              px-5
              py-3

              rounded-2xl

              border
              border-[var(--border-color)]

              bg-[var(--bg-secondary)]

              text-[var(--text-primary)]
              text-sm
              font-medium

              hover:bg-[var(--hover-bg)]

              transition-all
              duration-300
            "
          >
            <Printer
              size={16}
            />

            Print
          </button>

          {/* EXPORT */}

          <button
            onClick={
              handleExport
            }
            className="
              flex
              items-center
              gap-2

              px-5
              py-3

              rounded-2xl

              border
              border-[var(--border-color)]

              bg-[var(--bg-secondary)]

              text-[var(--text-primary)]
              text-sm
              font-medium

              hover:bg-[var(--hover-bg)]

              transition-all
              duration-300
            "
          >
            <FileOutput
              size={16}
            />

            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;