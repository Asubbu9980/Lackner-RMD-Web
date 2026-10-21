import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { useState } from "react";

import FluidSlider from "./FluidSlider";

const Harness = ({ initial, onChange = () => {}, ...props }) => {
  const [value, setValue] = useState(initial);

  return (
    <FluidSlider
      ariaLabel="growth rate"
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange(v);
      }}
      {...props}
    />
  );
};

describe("FluidSlider", () => {
  afterEach(cleanup);

  it("steps with the −/+ buttons without floating-point drift", () => {
    const onChange = vi.fn();
    render(<Harness initial={6} min={-5} max={15} step={0.5} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Increase growth rate" }));
    fireEvent.click(screen.getByRole("button", { name: "Increase growth rate" }));
    fireEvent.click(screen.getByRole("button", { name: "Decrease growth rate" }));

    expect(onChange.mock.calls.map(([v]) => v)).toEqual([6.5, 7, 6.5]);
    expect(screen.getByRole("slider", { name: "growth rate" })).toHaveAttribute("aria-valuetext", "6.5%");
  });

  it("clamps at the ends and disables the matching stepper", () => {
    render(<Harness initial={49} min={0} max={50} step={1} />);

    const plus = screen.getByRole("button", { name: "Increase growth rate" });
    fireEvent.click(plus);

    expect(screen.getByRole("slider")).toHaveValue("50");
    expect(plus).toBeDisabled();
  });

  it("accepts direct input from the native range (keyboard / drag)", () => {
    const onChange = vi.fn();
    render(<Harness initial={24} min={0} max={50} step={1} onChange={onChange} />);

    fireEvent.change(screen.getByRole("slider"), { target: { value: "32" } });

    expect(onChange).toHaveBeenCalledWith(32);
    expect(screen.getByText("32%")).toBeInTheDocument();
  });
});
