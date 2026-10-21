import { useState } from "react";
import { NavLink } from "react-router-dom";

import TopLoader from "./TopLoader";

import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
  IconButton,
  useMediaQuery,
} from "@mui/material";

import {
  LayoutDashboard,
  Compass,
  Sun,
  Moon,
  Save,
  FolderOpen,
  RotateCcw,
  Trash2,
  History,
  AArrowDown,
  AArrowUp,
} from "lucide-react";

import useRmd from "../../hooks/useRmd";
import useScenarioActions, { describeInputs } from "../../hooks/useScenarioActions";
import { useThemeContext } from "../../context/ThemeContext";
import { EngineToggle } from "./InputSections";

const LAYOUTS = [
  {
    to: "/dashboard/classic",
    label: "Classic",
    description: "The original dashboard",
    icon: History,
  },
  {
    to: "/dashboard",
    label: "Workspace",
    description: "All inputs and analytics side by side",
    icon: LayoutDashboard,
  },
  {
    to: "/dashboard/planner",
    label: "Planner",
    description: "Guided, step-by-step walkthrough",
    icon: Compass,
  },
];

// fill: equal-width segments across the row (phones/tablets, below the header)
export const LayoutTabs = ({ fill = false }) => (
  <nav
    aria-label="Dashboard layouts"
    className={`
      flex
      items-center
      gap-1
      p-1
      rounded-2xl
      border
      border-[var(--border-color)]
      bg-[var(--hover-bg)]
      ${fill ? "w-full sm:w-auto" : ""}
    `}
  >
    {/* native title, not MUI Tooltip — Tooltip overwrites NavLink's className function */}
    {LAYOUTS.map(({ to, label, description, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end
        title={description}
        className={({ isActive }) => `
          flex
          min-h-[2.75rem]
          items-center
          justify-center
          gap-2
          rounded-xl
          px-2
          sm:px-4
          py-1.5
          text-sm
          font-semibold
          transition-[background-color,color,box-shadow]
          duration-200
          hover:transform-none
          ${fill ? "flex-1 sm:flex-none" : ""}
          ${
            // same active look as the engine toggle (Segmented)
            isActive
              ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }
        `}
      >
        {/* icons drop on phones so all three labels fit at a readable size */}
        <Icon size={16} className={`shrink-0 ${fill ? "hidden min-[440px]:block" : ""}`} />
        {label}
      </NavLink>
    ))}
  </nav>
);

const StatusPill = () => {
  const { loading, error } = useRmd();

  const state = error ? "offline" : loading ? "calculating" : "live";

  const styles = {
    live: { dot: "bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]", text: "Live" },
    calculating: { dot: "bg-amber-400 animate-pulse", text: "Calculating…" },
    offline: { dot: "bg-rose-500", text: "Offline" },
  }[state];

  return (
    <div
      role="status"
      className="
        hidden
        md:flex
        xl:hidden
        2xl:flex
        items-center
        gap-2
        rounded-full
        border
        border-[var(--border-color)]
        px-3
        py-1.5
        text-sm
        font-semibold
        text-[var(--text-secondary)]
      "
    >
      <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
      {styles.text}
    </div>
  );
};

const SaveDialog = ({ open, onClose, onSave, defaultName }) => {
  const [name, setName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSave(name);
    setName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={submit}>
        <DialogTitle sx={{ fontWeight: 800 }}>Save scenario</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            margin="dense"
            label="Name"
            placeholder={defaultName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="Saved in this browser only."
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const ActionsMenu = () => {
  const { inputs } = useRmd();
  const actions = useScenarioActions();

  const [anchor, setAnchor] = useState(null);
  const [saveOpen, setSaveOpen] = useState(false);

  const close = () => setAnchor(null);

  const run = (fn) => () => {
    close();
    fn();
  };

  return (
    <>
      {/* one Save button: opens the menu with save, saved scenarios and reset */}
      <Tooltip title="Save, load or reset scenarios" describeChild>
        <button
          type="button"
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-haspopup="menu"
          aria-label="Save"
          className="
            flex
            h-11
            min-w-[2.75rem]
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-purple-400/50
            bg-purple-500/10
            px-3
            text-sm
            font-semibold
            text-purple-700
            hover:bg-purple-500/20
            dark:text-purple-200
          "
        >
          <Save size={18} />
          <span className="hidden sm:inline xl:hidden 2xl:inline">Save</span>
          {actions.saved.length > 0 && (
            <span className="rounded-full bg-purple-600 px-1.5 text-xs font-bold text-white">
              {actions.saved.length}
            </span>
          )}
        </button>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 260,
              maxWidth: "calc(100vw - 24px)",
              borderRadius: 3,
              mt: 1,
              // roomy rows for touch and older eyes
              "& .MuiMenuItem-root": { minHeight: 48, py: 1 },
              "& .MuiListItemText-primary": { fontSize: "1rem", fontWeight: 600 },
              "& .MuiListItemText-secondary": { fontSize: "0.875rem" },
            },
          },
        }}
      >
        <MenuItem onClick={run(() => setSaveOpen(true))}>
          <ListItemIcon><Save size={16} /></ListItemIcon>
          <ListItemText primary="Save current scenario" secondary={describeInputs(inputs)} />
        </MenuItem>

        {actions.saved.length > 0 && <Divider />}

        {actions.saved.map((s) => (
          <MenuItem key={s.id} onClick={run(() => actions.loadSaved(s.id))}>
            <ListItemIcon><FolderOpen size={16} /></ListItemIcon>
            <ListItemText
              primary={s.name}
              secondary={new Date(s.savedAt).toLocaleDateString()}
              slotProps={{ primary: { noWrap: true, sx: { maxWidth: 180 } } }}
            />
            <IconButton
              size="small"
              aria-label={`Delete ${s.name}`}
              sx={{ width: 40, height: 40 }}
              onClick={(e) => {
                e.stopPropagation();
                actions.removeSaved(s.id);
              }}
            >
              <Trash2 size={14} />
            </IconButton>
          </MenuItem>
        ))}

        <Divider />

        <MenuItem onClick={run(actions.reset)}>
          <ListItemIcon><RotateCcw size={16} /></ListItemIcon>
          <ListItemText primary="Reset to defaults" />
        </MenuItem>
      </Menu>

      <SaveDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSave={actions.saveCurrent}
        defaultName={describeInputs(inputs)}
      />
    </>
  );
};

// Large A−/A+ buttons — the dashboard is used by many readers over 50
const FontSizeControl = ({ fontScale }) => {
  const { percent, canDecrease, canIncrease, decrease, increase, reset } = fontScale;

  const stepClass = `
    flex
    h-full
    w-11
    items-center
    justify-center
    text-[var(--text-primary)]
    hover:bg-[var(--hover-bg)]
    hover:transform-none
    active:scale-90
    disabled:opacity-35
    disabled:hover:bg-transparent
  `;

  return (
    <div
      role="group"
      aria-label="Text size"
      className="
        flex
        h-11
        items-center
        overflow-hidden
        rounded-xl
        border
        border-[var(--border-color)]
        bg-[var(--bg-secondary)]
      "
    >
      <button
        type="button"
        onClick={decrease}
        disabled={!canDecrease}
        aria-label="Decrease text size"
        title="Smaller text"
        className={stepClass}
      >
        <AArrowDown size={19} />
      </button>

      <button
        type="button"
        onClick={reset}
        title="Reset text size"
        aria-label={`Text size ${percent}%, reset`}
        className="
          h-full
          min-w-[3.25rem]
          border-x
          border-[var(--border-color)]
          px-1
          text-sm
          font-bold
          tabular-nums
          text-[var(--text-primary)]
          hover:bg-[var(--hover-bg)]
          hover:transform-none
        "
      >
        {percent}%
      </button>

      <button
        type="button"
        onClick={increase}
        disabled={!canIncrease}
        aria-label="Increase text size"
        title="Larger text"
        className={stepClass}
      >
        <AArrowUp size={21} />
      </button>
    </div>
  );
};

const DashboardNavbar = ({ fontScale }) => {
  const { mode, toggleTheme } = useThemeContext();

  const isDark = mode === "dark";

  // Wide screens: one row. Phones/tablets: a compact sticky row (brand + the
  // controls readers need most), with the layout switcher as a full-width row
  // below it that scrolls away — keeps the sticky bar short on small screens.
  const wide = useMediaQuery("(min-width: 1280px)", { noSsr: true });

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-[var(--border-color)]
          bg-[var(--glass-bg)]
          backdrop-blur-2xl
          print:hidden
        "
      >
        <TopLoader />

        <div
          className="
            mx-auto
            flex
            max-w-[1800px]
            items-center
            gap-3
            px-4
            py-2
            sm:px-5
            lg:gap-4
          "
        >
          {/* BRAND */}
          <NavLink
            to="/"
            aria-label="Leimberg LeClair Lackner — home"
            className="flex h-11 min-w-0 shrink items-center gap-3 rounded-xl"
          >
            <span
              className="
                flex
                h-full
                min-w-0
                items-center
                rounded-xl
                border
                px-2.5
                sm:px-3
              "
              style={{
                background: isDark ? "rgba(255,255,255,0.96)" : "#ffffff",
                borderColor: isDark ? "rgba(255,255,255,0.12)" : "var(--border-color)",
              }}
            >
              {/* the 12:1 wordmark is unreadable at phone widths — use the mark there */}
              <img
                src="/lackner.png"
                alt=""
                className="block h-7 w-auto object-contain sm:hidden"
              />
              <img
                src="/LeimbergLeClairLackner_logo.png"
                alt=""
                className="hidden h-5 w-auto max-w-full object-contain sm:block 2xl:h-6"
              />
            </span>

            <span className="hidden min-w-0 flex-col justify-center min-[480px]:flex sm:hidden">
              <span className="truncate text-base font-black leading-5 tracking-tight text-[var(--text-primary)]">
                RMD Calculator
              </span>
            </span>
          </NavLink>

          {/* LAYOUTS — inline on wide screens */}
          {wide && (
            <div className="flex min-w-0 flex-1 justify-center">
              <LayoutTabs />
            </div>
          )}

          {/* RIGHT */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <StatusPill />

            <EngineToggle className="hidden w-[250px] lg:block" />

            <FontSizeControl fontScale={fontScale} />

            <ActionsMenu />

            <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-secondary)]
                  hover:bg-[var(--hover-bg)]
                "
              >
                {isDark ? <Sun size={19} className="text-yellow-300" /> : <Moon size={19} className="text-slate-700" />}
              </button>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* LAYOUTS — own row on phones/tablets */}
      {!wide && (
        <div className="relative z-30 mx-auto flex max-w-[1800px] justify-center px-4 pt-3 sm:px-5 print:hidden">
          <LayoutTabs fill />
        </div>
      )}
    </>
  );
};

export default DashboardNavbar;
