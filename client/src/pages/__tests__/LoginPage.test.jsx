import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CustomThemeProvider } from "../../context/ThemeContext";
import LoginPage from "../LoginPage";

// HeroFinancialGraph mounts a WebGL <Canvas> jsdom can't run — stub it.
vi.mock("../../components/HeroFinancialGraph", () => ({
  default: () => <div data-testid="hero-graph" />,
}));

function renderLogin() {
  return render(
    <CustomThemeProvider>
      <MemoryRouter initialEntries={["/login"]}>
        <LoginPage />
      </MemoryRouter>
    </CustomThemeProvider>,
  );
}

afterEach(cleanup);

describe("LoginPage visualization", () => {
  // AC1 — the animated HeroFinancialGraph renders in the panel.
  it("renders the animated HeroFinancialGraph", () => {
    renderLogin();
    expect(screen.getByTestId("hero-graph")).toBeInTheDocument();
  });

  // AC2 — the old static SVG curve (linearGradient#curve2) is gone.
  it("no longer renders the static SVG curve", () => {
    const { container } = renderLogin();
    expect(container.querySelector("#curve2")).toBeNull();
    expect(container.querySelector("linearGradient")).toBeNull();
  });

  // AC3 — the 40px grid-overlay backdrop is present (matching the landing page).
  it("includes the 40px grid-overlay backdrop", () => {
    renderLogin();
    const styleText = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent)
      .join("");
    expect(styleText).toContain("40px 40px");
  });
});
