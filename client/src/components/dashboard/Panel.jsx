// Consistent card surface for every dashboard section.
const Panel = ({
  icon: Icon,
  title,
  subtitle,
  actions,
  accent = "from-purple-500 to-indigo-600",
  padded = true,
  className = "",
  children,
}) => (
  <section
    className={`
      relative
      min-w-0
      rounded-[var(--card-radius)]
      border
      border-[var(--border-color)]
      bg-[var(--glass-bg)]
      backdrop-blur-xl
      shadow-[var(--shadow-md)]
      transition-colors
      duration-300
      ${className}
    `}
  >
    {title && (
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <div
              className={`
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                ${accent}
                shadow-[0_6px_18px_rgba(124,58,237,0.25)]
              `}
            >
              <Icon size={17} className="text-white" />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-base font-extrabold tracking-tight text-[var(--text-primary)]">
              {title}
            </h2>

            {subtitle && <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>}
          </div>
        </div>

        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
    )}

    <div className={padded ? "px-5 pb-5" : ""}>{children}</div>
  </section>
);

export default Panel;
