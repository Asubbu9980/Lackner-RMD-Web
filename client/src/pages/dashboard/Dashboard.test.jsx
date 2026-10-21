import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import calculateSchedule from "../../../../server/services/rmdCalculator";

import { RmdProvider } from "../../context/RmdContext";
import { RenderModeProvider } from "../../context/RenderModeContext";
import { CustomThemeProvider } from "../../context/ThemeContext";
import Calculator from "../Calculator";
import WorkspaceLayout from "./WorkspaceLayout";
import PlannerLayout from "./PlannerLayout";
import { BASE_ZOOM } from "../../hooks/useFontScale";
import ClassicLayout from "./ClassicLayout";

// Run the real server math in-process instead of hitting the network
vi.mock("../../services/api", () => ({
  calculateRmd: vi.fn(async (inputs) => ({ result: calculateSchedule(inputs) })),
}));

// The chart components need WebGL/canvas; jsdom has neither
vi.mock("../../components/dashboard/ResultSections", () => ({
  ProjectionSection: () => <div>projection-chart</div>,
  WaterfallSection: () => <div>waterfall-chart</div>,
  TableSection: () => <div>year-table</div>,
  ResultsSkeleton: () => <div>loading</div>,
}));

vi.mock("../../components/AdvancedChart", () => ({ default: () => <div>classic-projection</div> }));
vi.mock("../../components/WaterfallChart", () => ({ default: () => <div>classic-waterfall</div> }));

const renderAt = (path) =>
  render(
    <CustomThemeProvider>
      <RmdProvider>
        <RenderModeProvider>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/dashboard" element={<Calculator />}>
                <Route index element={<WorkspaceLayout />} />
                <Route path="planner" element={<PlannerLayout />} />
                <Route path="classic" element={<ClassicLayout />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </RenderModeProvider>
      </RmdProvider>
    </CustomThemeProvider>,
  );

describe("dashboard layouts", () => {
  // globals are off in vitest config, so RTL can't register its own cleanup
  afterEach(cleanup);

  it("switches between Workspace and Planner from the navbar", async () => {
    renderAt("/dashboard");

    const nav = screen.getByRole("navigation", { name: "Dashboard layouts" });
    expect(within(nav).getByRole("link", { name: /Workspace/ })).toHaveAttribute("aria-current", "page");
    expect(await screen.findByText("Inputs")).toBeInTheDocument();

    fireEvent.click(within(nav).getByRole("link", { name: /Planner/ }));

    expect(within(nav).getByRole("link", { name: /Planner/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("What kind of account is it, and how much is in it?")).toBeInTheDocument();
  });

  it("keeps the original dashboard as the Classic layout", async () => {
    renderAt("/dashboard/classic");

    const nav = screen.getByRole("navigation", { name: "Dashboard layouts" });
    expect(within(nav).getByRole("link", { name: /Classic/ })).toHaveAttribute("aria-current", "page");

    // shared navbar on top, original form, summary cards and charts below
    expect(screen.getByRole("button", { name: /Actions/ })).toBeInTheDocument();
    expect(screen.getByText("Input Parameters")).toBeInTheDocument();
    expect(await screen.findByText("Total RMDs")).toBeInTheDocument();
    expect(screen.getByText("classic-projection")).toBeInTheDocument();
    expect(screen.getByText("classic-waterfall")).toBeInTheDocument();

    fireEvent.click(within(nav).getByRole("link", { name: /Workspace/ }));
    expect(await screen.findByText("Inputs")).toBeInTheDocument();
    expect(screen.queryByText("Input Parameters")).not.toBeInTheDocument();
  });

  it("Classic shows scenarios as pills and rates as sliders", async () => {
    renderAt("/dashboard/classic");

    const pills = within(screen.getByRole("radiogroup", { name: "Scenario" })).getAllByRole("radio");
    expect(pills).toHaveLength(6);
    expect(pills[0]).toHaveAttribute("aria-checked", "true");

    fireEvent.click(screen.getByRole("radio", { name: /Non-Spouse EDB/ }));
    expect(screen.getByRole("radio", { name: /Non-Spouse EDB/ })).toHaveAttribute("aria-checked", "true");

    fireEvent.click(screen.getByRole("button", { name: "Increase tax rate" }));
    expect(screen.getByRole("slider", { name: "tax rate" })).toHaveValue("25");
  });

  it("text-size control scales the page and remembers the choice", () => {
    localStorage.removeItem("rmd.fontScale.v2");
    renderAt("/dashboard");

    const root = document.documentElement;
    const increase = screen.getByRole("button", { name: "Increase text size" });

    fireEvent.click(increase);
    expect(root.style.getPropertyValue("--app-zoom")).toBe(String(BASE_ZOOM * 1.1));
    expect(screen.getByRole("button", { name: /Text size 110%/ })).toBeInTheDocument();

    fireEvent.click(increase);
    fireEvent.click(increase);
    expect(increase).toBeDisabled();
    expect(localStorage.getItem("rmd.fontScale.v2")).toBe("3");

    fireEvent.click(screen.getByRole("button", { name: /Text size 140%/ }));
    expect(screen.getByRole("button", { name: "Decrease text size" })).toBeDisabled();

    cleanup();
    expect(root.style.getPropertyValue("--app-zoom")).toBe("");
  });

  it("Workspace shows KPIs once the projection loads", async () => {
    renderAt("/dashboard");

    expect(await screen.findByText("First RMD")).toBeInTheDocument();
    expect(screen.getByText("projection-chart")).toBeInTheDocument();
    expect(screen.getByText("waterfall-chart")).toBeInTheDocument();
  });

  it("Workspace asks for a date of death when an inherited scenario is picked", async () => {
    renderAt("/dashboard");

    fireEvent.click(await screen.findByRole("radio", { name: /10-Year Rule\b(?! \+)/ }));

    expect(await screen.findByText("Add the owner's date of death")).toBeInTheDocument();
    expect(screen.getByLabelText("Owner date of death")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Owner date of death"), { target: { value: "2024-05-01" } });

    expect(screen.queryByText("Add the owner's date of death")).not.toBeInTheDocument();
  });

  it("Planner walks through steps and filters scenarios by owner status", async () => {
    renderAt("/dashboard/planner");

    fireEvent.click(screen.getByRole("button", { name: /Next: People/ }));
    expect(screen.getByText("Who owns the account, and who inherits it?")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /No, inherited/ }));
    expect(screen.getByLabelText("Owner date of death")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Next: Scenario/ }));

    const picker = screen.getByRole("radiogroup", { name: /Inherited/ });
    expect(within(picker).getAllByRole("radio")).toHaveLength(4);
    expect(screen.queryByRole("radio", { name: /Uniform Lifetime/ })).not.toBeInTheDocument();
  });
});
