import { Clapperboard, Download, Play, RefreshCw } from "lucide-react";

import Panel from "./Panel";
import { Notice } from "./Notices";
import { CINEMATIC_SCENES } from "../../hooks/useCinematic";

const ProgressOverlay = ({ progress, stage }) => {
  const circumference = 2 * Math.PI * 42;

  return (
    <div
      className="
        absolute
        inset-0
        z-20
        flex
        flex-col
        items-center
        justify-center
        px-10
        bg-black/90
        backdrop-blur-md
      "
    >
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className="stroke-purple-500/20" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className="stroke-purple-400"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference * (1 - progress / 100),
              transition: "stroke-dashoffset 0.4s ease",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
          {Math.round(progress)}%
        </div>
      </div>

      <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-purple-500/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"
          style={{ width: `${progress}%`, transition: "width 0.4s ease" }}
        />
      </div>

      <p className="mt-4 text-sm font-semibold text-purple-300">
        {stage || "Rendering Manim analytics..."}
      </p>
    </div>
  );
};

// 3Blue1Brown-style Manim videos rendered by the Python backend.
// `cinematic` comes from useCinematic() in the dashboard shell so a render
// survives switching tabs and layouts.
const CinematicPanel = ({ cinematic }) => {
  const { generate, videoUrl, isRendering, progress, stage, error, scene } = cinematic;

  const activeScene = CINEMATIC_SCENES.find((s) => s.id === scene);

  return (
    <Panel
      icon={Clapperboard}
      title="Cinematic Analytics"
      subtitle={
        activeScene
          ? `${activeScene.title} · rendered with Manim`
          : "Narrated 3Blue1Brown-style videos of this projection"
      }
      actions={
        videoUrl && (
          <>
            <button
              type="button"
              disabled={isRendering}
              onClick={() => generate(scene)}
              className="
                flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-[var(--border-color)]
                px-3
                py-1.5
                text-xs
                font-semibold
                text-[var(--text-primary)]
                hover:bg-[var(--hover-bg)]
                disabled:opacity-50
              "
            >
              <RefreshCw size={13} />
              Re-render
            </button>

            <a
              href={videoUrl}
              download
              className="
                flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-[var(--border-color)]
                px-3
                py-1.5
                text-xs
                font-semibold
                text-[var(--text-primary)]
                hover:bg-[var(--hover-bg)]
              "
            >
              <Download size={13} />
              Download
            </a>
          </>
        )
      }
    >
      {/* SCENE PICKER */}
      <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {CINEMATIC_SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={isRendering}
            onClick={() => generate(s.id)}
            className={`
              group
              rounded-xl
              border
              p-3
              text-left
              disabled:cursor-not-allowed
              disabled:opacity-60
              ${
                scene === s.id
                  ? "border-purple-400/60 bg-purple-500/10"
                  : "border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-purple-400/40"
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${s.accent} text-white`}
              >
                <Play size={11} fill="currentColor" />
              </span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">{s.title}</span>
            </span>

            <span className="mt-1.5 block text-xs leading-snug text-[var(--text-secondary)]">
              {s.description}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4">
          <Notice tone="rose">{error}</Notice>
        </div>
      )}

      {/* STAGE */}
      <div
        className="
          relative
          flex
          aspect-video
          w-full
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          border
          border-purple-500/20
          bg-black
        "
      >
        {isRendering && <ProgressOverlay progress={progress} stage={stage} />}

        {videoUrl ? (
          <video key={videoUrl} controls autoPlay preload="auto" className="h-full w-full bg-black object-contain">
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          !isRendering && (
            <div className="px-6 text-center">
              <Clapperboard size={32} className="mx-auto text-purple-400/70" />
              <p className="mt-3 text-sm font-semibold text-white/90">Pick an analysis above to render a video</p>
              <p className="mt-1 text-xs text-white/50">Progress is shown here while the video renders.</p>
            </div>
          )
        )}
      </div>
    </Panel>
  );
};

export default CinematicPanel;
