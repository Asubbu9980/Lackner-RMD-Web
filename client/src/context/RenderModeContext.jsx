import {
  createContext,
  useContext,
  useState,
} from "react";

const RenderModeContext =
  createContext();

export const RenderModeProvider = ({
  children,
}) => {

  const [renderMode, setRenderMode] =
    useState("node");

  return (
    <RenderModeContext.Provider
      value={{
        renderMode,
        setRenderMode,
      }}
    >
      {children}
    </RenderModeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRenderMode = () =>
  useContext(RenderModeContext);