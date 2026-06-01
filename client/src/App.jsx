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

import { RenderModeProvider } from "./context/RenderModeContext";

// import LandingPage from "./pages/LandingPage";
// import LoginPage from "./pages/LoginPage";

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

           
            {/* <Route
              path="/"
              element={<LandingPage />}
            />

            
            <Route
              path="/login"
              element={<LoginPage />}
            /> */}

            {/* DASHBOARD */}
            <Route
              path="/"
              element={<Calculator />}
            />

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