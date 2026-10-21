import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";

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
} from "@mui/material";

import {
  LayoutDashboard,
  Compass,
  Sun,
  Moon,
  Ellipsis,
  Save,
  FolderOpen,
  Upload,
  FileJson,
  FileSpreadsheet,
  Printer,
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

export const LayoutTabs = () => (
  <nav
    aria-label="Dashboard layouts"
    className="
      flex
      items-center
      gap-1
      p-1
      rounded-xl
      border
      border-[var(--border-color)]
      bg-[var(--hover-bg)]
    "
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
          items-center
          gap-2
          rounded-lg
          px-3
          sm:px-4
          py-2
          text-sm
          font-semibold
          transition-all
          duration-200
          ${
            isActive
              ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-[var(--shadow-sm)] ring-1 ring-purple-400/30"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }
        `}
      >
        <Icon size={16} />
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
        items-center
        gap-2
        rounded-full
        border
        border-[var(--border-color)]
        px-3
        py-1.5
        text-xs
        font-semibold
        text-[var(--text-secondary)]
      "
    >
      <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
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
  const [importError, setImportError] = useState("");

  const fileRef = useRef(null);

  const close = () => setAnchor(null);

  const run = (fn) => () => {
    close();
    fn();
  };

  const openFilePicker = () => {
    close();
    fileRef.current?.click();
  };

  const onImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      await actions.importJson(file);
      setImportError("");
    } catch {
      setImportError("That file isn't a valid RMD inputs export.");
    }
  };

  return (
    <>
      <Tooltip title="Save, load, import, export, print" describeChild>
        <button
          type="button"
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-haspopup="menu"
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[var(--border-color)]
            bg-[var(--bg-secondary)]
            px-3
            py-2
            text-sm
            font-semibold
            text-[var(--text-primary)]
            hover:bg-[var(--hover-bg)]
          "
        >
          <Ellipsis size={16} />
          <span className="hidden sm:inline">Actions</span>
          {actions.saved.length > 0 && (
            <span className="rounded-full bg-purple-500 px-1.5 text-[10px] font-bold text-white">
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
        slotProps={{ paper: { sx: { minWidth: 260, borderRadius: 3, mt: 1 } } }}
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

        <MenuItem onClick={openFilePicker}>
          <ListItemIcon><Upload size={16} /></ListItemIcon>
          <ListItemText primary="Import inputs (JSON)" />
        </MenuItem>

        <MenuItem onClick={run(actions.exportJson)}>
          <ListItemIcon><FileJson size={16} /></ListItemIcon>
          <ListItemText primary="Export inputs (JSON)" />
        </MenuItem>

        <MenuItem onClick={run(actions.exportCsv)} disabled={!actions.canExportCsv}>
          <ListItemIcon><FileSpreadsheet size={16} /></ListItemIcon>
          <ListItemText primary="Export projection (CSV)" />
        </MenuItem>

        <MenuItem onClick={run(actions.print)}>
          <ListItemIcon><Printer size={16} /></ListItemIcon>
          <ListItemText primary="Print report" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={run(actions.reset)}>
          <ListItemIcon><RotateCcw size={16} /></ListItemIcon>
          <ListItemText primary="Reset to defaults" />
        </MenuItem>
      </Menu>

      <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />

      <SaveDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSave={actions.saveCurrent}
        defaultName={describeInputs(inputs)}
      />

      {importError && (
        <div
          role="alert"
          className="fixed bottom-4 right-4 z-50 rounded-xl bg-rose-600 px-4 py-2.5 text-sm text-white shadow-lg"
          onClick={() => setImportError("")}
        >
          {importError}
        </div>
      )}
    </>
  );
};

// Large A−/A+ buttons — the dashboard is used by many readers over 50
const FontSizeControl = ({ fontScale }) => {
  const { percent, canDecrease, canIncrease, decrease, increase, reset } = fontScale;

  const stepClass = `
    flex
    h-full
    items-center
    justify-center
    px-2.5
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
        h-9
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
        <AArrowDown size={17} />
      </button>

      <button
        type="button"
        onClick={reset}
        title="Reset text size"
        aria-label={`Text size ${percent}%, reset`}
        className="
          h-full
          min-w-[50px]
          border-x
          border-[var(--border-color)]
          px-1
          text-xs
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
        <AArrowUp size={19} />
      </button>
    </div>
  );
};

const DashboardNavbar = ({ fontScale }) => {
  const { mode, toggleTheme } = useThemeContext();

  const isDark = mode === "dark";

  return (
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
      <div
        className="
          mx-auto
          flex
          max-w-[1800px]
          flex-wrap
          items-center
          gap-x-4
          gap-y-2
          px-3
          py-2.5
          lg:px-5
        "
      >
        {/* BRAND */}
        <NavLink to="/" className="flex h-10 shrink-0 items-center gap-3">
          <span
            className="
              flex
              h-full
              items-center
              rounded-xl
              border
              px-3
            "
            style={{
              background: isDark ? "rgba(255,255,255,0.96)" : "#ffffff",
              borderColor: isDark ? "rgba(255,255,255,0.12)" : "var(--border-color)",
            }}
          >
            <img
              src="/LeimbergLeClairLackner_logo.png"
              alt="Leimberg LeClair Lackner"
              className="block h-5 w-auto object-contain sm:h-6"
            />
          </span>

          <span aria-hidden className="hidden h-7 w-px bg-[var(--border-color)] xl:block" />

          <span className="hidden flex-col justify-center xl:flex">
            <span className="text-sm font-black leading-5 tracking-tight text-[var(--text-primary)]">
              RMD Calculator
            </span>
            <span className="text-[11px] leading-4 text-[var(--text-secondary)]">
              Leimberg Financial Intelligence
            </span>
          </span>
        </NavLink>

        {/* LAYOUTS */}
        <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1 flex justify-center">
          <LayoutTabs />
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-2 sm:ml-0">
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
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-secondary)]
                hover:bg-[var(--hover-bg)]
              "
            >
              {isDark ? <Sun size={16} className="text-yellow-300" /> : <Moon size={16} className="text-slate-700" />}
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
