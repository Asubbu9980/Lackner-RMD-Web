import { Routes, Route } from "react-router-dom";

import { RmdProvider } from "./context/RmdContext";
import {
  CustomThemeProvider,
  useThemeContext,
} from "./context/ThemeContext";

import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";

import { useMemo } from "react";

import { getDesignTokens } from "./theme";

import Calculator from "./pages/Calculator";
import WorkspaceLayout from "./pages/dashboard/WorkspaceLayout";
import PlannerLayout from "./pages/dashboard/PlannerLayout";
import ClassicLayout from "./pages/dashboard/ClassicLayout";

import { RenderModeProvider } from "./context/RenderModeContext";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

const AppContent = () => {

  const { mode } = useThemeContext();

  const muiTheme = useMemo(
    () => createTheme(getDesignTokens(mode)),
    [mode]
  );

  return (

    <MuiThemeProvider theme={muiTheme}>

      <RmdProvider>

        <RenderModeProvider>

          <Routes>

           
            <Route
              path="/"
              element={<LandingPage />}
            />

            
            <Route
              path="/login"
              element={<LoginPage />}
            />  

            {/* DASHBOARD — shared navbar, two layouts */}
            <Route
              path="/dashboard"
              element={<Calculator />}
            >
              <Route index element={<WorkspaceLayout />} />
              <Route path="planner" element={<PlannerLayout />} />
              <Route path="classic" element={<ClassicLayout />} />
            </Route>

          </Routes>

        </RenderModeProvider>

      </RmdProvider>

    </MuiThemeProvider>
  );
};

function App() {

  return (

    <CustomThemeProvider>

      <AppContent />

    </CustomThemeProvider>
  );
}

export default App;