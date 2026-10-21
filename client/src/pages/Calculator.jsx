import { Outlet } from "react-router-dom";

import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import useCinematic from "../hooks/useCinematic";
import useFontScale from "../hooks/useFontScale";

// Shell for every /dashboard layout: navbar + background, with the active
// layout rendered in the <Outlet />. The cinematic render lives here so a
// video keeps rendering when the user switches layouts.
const Calculator = () => {
  const cinematic = useCinematic();
  const fontScale = useFontScale();

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-x-clip
        bg-[var(--bg-primary)]
        transition-colors
        duration-300
      "
    >
      {/* BACKGROUND GLOWS */}
      <div
        className="
          pointer-events-none
          fixed
          -top-56
          -right-44
          z-0
          h-[420px]
          w-[420px]
          rounded-full
          bg-purple-500/10
          blur-3xl
          print:hidden
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          -bottom-56
          left-[20%]
          z-0
          h-[380px]
          w-[380px]
          rounded-full
          bg-indigo-500/10
          blur-3xl
          print:hidden
        "
      />

      <DashboardNavbar fontScale={fontScale} />

      <main className="relative z-10 mx-auto w-full max-w-[1800px] p-3 lg:p-5">
        <Outlet context={{ cinematic }} />
      </main>
    </div>
  );
};

export default Calculator;
