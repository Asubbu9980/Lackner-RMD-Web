import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CustomThemeProvider } from "../../context/ThemeContext";
import LandingPage from "../LandingPage";

vi.mock("../../components/HeroFinancialGraph", () => ({
  default: () => <div data-testid="hero-graph" />,
}));

afterEach(cleanup);

describe("LandingPage visualization (regression guard)", () => {
  // AC4 — landing page is unchanged and still renders HeroFinancialGraph.
  it("still renders HeroFinancialGraph", () => {
    render(
      <CustomThemeProvider>
        <MemoryRouter initialEntries={["/"]}>
          <LandingPage />
        </MemoryRouter>
      </CustomThemeProvider>,
    );
    expect(screen.getByTestId("hero-graph")).toBeInTheDocument();
  });
});
