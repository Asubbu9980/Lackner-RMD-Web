import { Landmark, Building2, Sprout, Box, Clapperboard } from "lucide-react";

import useRmd from "../../hooks/useRmd";
import { useRenderMode } from "../../context/RenderModeContext";
import { PLAN_TYPES, getScenario, isDeceasedScenario, validateInputs } from "../../utils/rmd";

import { Field, CurrencyInput, NumberInput, RateInput, Segmented } from "./fields";
import { inputClass, BALANCE_PRESETS, GROWTH_PRESETS, TAX_PRESETS } from "./styles";

const PLAN_ICONS = { IRA: Landmark, "401k": Building2, Roth: Sprout };

const thisYear = new Date().getFullYear();

// =====================================================
// ACCOUNT — plan type + balance
// =====================================================

export const AccountFields = () => {
  const { inputs, updateInput } = useRmd();
  const { errors } = validateInputs(inputs);

  return (
    <div className="space-y-4">
      <Field label="Plan type">
        <Segmented
          ariaLabel="Plan type"
          value={inputs.plan}
          onChange={(v) => updateInput("plan", v)}
          options={PLAN_TYPES.map((p) => ({ value: p.id, label: p.short, icon: PLAN_ICONS[p.id] }))}
        />
      </Field>

      <Field
        label="Account balance"
        htmlFor="balance_Start"
        hint="Balance as of December 31 of the prior year."
        error={errors.balance_Start}
      >
        <CurrencyInput
          id="balance_Start"
          value={inputs.balance_Start}
          onChange={(v) => updateInput("balance_Start", v)}
          error={errors.balance_Start}
          presets={BALANCE_PRESETS}
        />
      </Field>
    </div>
  );
};

// =====================================================
// PEOPLE — owner, beneficiary, date of death
// =====================================================

export const PeopleFields = () => {
  const { inputs, updateInput } = useRmd();
  const { errors } = validateInputs(inputs);

  const scenario = getScenario(inputs.scenario);
  const inherited = isDeceasedScenario(inputs.scenario);

  const ownerAge = thisYear - inputs.year_Birth_Owner;
  const benyAge = thisYear - inputs.year_Birth_Beny;

  const benyLabel = inputs.scenario === "LIVING_JOINT" ? "Spouse born" : "Beneficiary born";

  const benyHint = scenario.usesBeneficiary
    ? inputs.scenario === "LIVING_JOINT"
      ? "Must be more than 10 years younger than the owner."
      : "Used to set the beneficiary's life expectancy."
    : "Not used by the Uniform Lifetime table.";

  return (
    <div className="grid grid-cols-2 gap-4">
      <Field
        label="Owner born"
        htmlFor="year_Birth_Owner"
        error={errors.year_Birth_Owner}
      >
        <NumberInput
          id="year_Birth_Owner"
          min={1900}
          max={thisYear}
          step={1}
          value={inputs.year_Birth_Owner}
          onChange={(v) => updateInput("year_Birth_Owner", Math.round(v))}
          error={errors.year_Birth_Owner}
          suffix={ownerAge > 0 && ownerAge < 130 ? `Age ${ownerAge}` : null}
          className="pr-16"
        />
      </Field>

      <Field
        label={benyLabel}
        htmlFor="year_Birth_Beny"
        error={errors.year_Birth_Beny}
      >
        <NumberInput
          id="year_Birth_Beny"
          min={1900}
          max={thisYear}
          step={1}
          value={inputs.year_Birth_Beny}
          onChange={(v) => updateInput("year_Birth_Beny", Math.round(v))}
          error={errors.year_Birth_Beny}
          suffix={benyAge > 0 && benyAge < 130 ? `Age ${benyAge}` : null}
          className={`pr-16 ${scenario.usesBeneficiary ? "" : "opacity-70"}`}
        />
      </Field>

      <p className="col-span-2 -mt-2 text-xs text-[var(--text-secondary)]">{benyHint}</p>

      {inherited && (
        <div className="col-span-2">
          <Field
            label="Owner date of death"
            htmlFor="date_Death_Owner"
            error={errors.date_Death_Owner}
            hint="Distributions to the beneficiary start the year after death."
          >
            <input
              id="date_Death_Owner"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={inputs.date_Death_Owner}
              onChange={(e) => updateInput("date_Death_Owner", e.target.value)}
              className={inputClass(errors.date_Death_Owner)}
            />
          </Field>
        </div>
      )}
    </div>
  );
};

// =====================================================
// ASSUMPTIONS — growth + tax
// =====================================================

export const AssumptionFields = () => {
  const { inputs, updateInput } = useRmd();
  const { errors } = validateInputs(inputs);

  return (
    <div className="space-y-5">
      <Field
        label="Annual growth rate"
        htmlFor="growth_Rate"
        hint="Expected average return on the remaining balance."
        error={errors.growth_Rate}
      >
        <RateInput
          id="growth_Rate"
          label="growth rate"
          tone="growth"
          min={-5}
          max={15}
          step={0.5}
          value={inputs.growth_Rate}
          onChange={(v) => updateInput("growth_Rate", v)}
          presets={GROWTH_PRESETS}
        />
      </Field>

      <Field
        label="Tax rate on distributions"
        htmlFor="tax_Rate"
        hint="Marginal federal + state rate applied to each RMD."
        error={errors.tax_Rate}
      >
        <RateInput
          id="tax_Rate"
          label="tax rate"
          tone="tax"
          min={0}
          max={50}
          step={1}
          value={inputs.tax_Rate}
          onChange={(v) => updateInput("tax_Rate", v)}
          presets={TAX_PRESETS}
        />
      </Field>
    </div>
  );
};

// =====================================================
// ENGINE TOGGLE — shown in-page where the navbar hides it
// =====================================================

export const EngineToggle = ({ className = "" }) => {
  const { renderMode, setRenderMode } = useRenderMode();

  return (
    <div className={className}>
      <Segmented
        ariaLabel="Chart engine"
        value={renderMode}
        onChange={setRenderMode}
        options={[
          { value: "node", label: "Interactive 3D", icon: Box },
          { value: "python", label: "3Blue1Brown", icon: Clapperboard },
        ]}
      />
    </div>
  );
};
