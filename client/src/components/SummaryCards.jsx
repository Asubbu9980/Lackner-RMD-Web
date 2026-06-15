import useRmd from "../hooks/useRmd";

import {
  Wallet,
  TrendingUp,
  Landmark,
  PiggyBank,
} from "lucide-react";

const format = (n) =>
  "$" +
  Math.round(
    n || 0
  ).toLocaleString();

const cards = (
  result
) => [
  {
    title:
      "Starting Balance",

    value: format(
      result.balanceStart
    ),

    subtitle: `${
      result.rows?.length || 0
    } years projected`,

    icon: Wallet,

    glow:
      "from-purple-400/20 to-indigo-500/10",

    border:
      "border-purple-400/15",

    iconColor:
      "text-purple-300",
  },

  {
    title: "Total RMDs",

    value: format(
      result.totalRmd
    ),

    subtitle: `${(
      (result.totalRmd /
        result.balanceStart) *
      100
    ).toFixed(1)}% of start`,

    icon: TrendingUp,

    glow:
      "from-purple-500/20 to-fuchsia-500/10",

    border:
      "border-purple-400/15",

    iconColor:
      "text-purple-300",
  },

  {
    title: "Total Taxes",

    value: format(
      result.totalTax
    ),

    subtitle: `${(
      (result.totalTax /
        result.totalRmd) *
      100
    ).toFixed(1)}% of RMDs`,

    icon: Landmark,

    glow:
      "from-red-500/20 to-orange-500/10",

    border:
      "border-red-400/15",

    iconColor:
      "text-red-300",

    danger: true,
  },

  {
    title:
      "Ending Balance",

    value: format(
      result.endingBalance
    ),

    subtitle:
      "Final projected value",

    icon: PiggyBank,

    glow:
      "from-emerald-500/20 to-green-500/10",

    border:
      "border-emerald-400/15",

    iconColor:
      "text-emerald-300",
  },
];

const SummaryCards = () => {
  const { result } =
    useRmd();

  if (!result) return null;

  return (
    <div
      className="
        grid

        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4

        gap-5
      "
    >
      {cards(result).map(
        (
          card,
          index
        ) => {
          const Icon =
            card.icon;

          return (
            <div
              key={index}
              className={`
                relative

                overflow-hidden

                rounded-3xl

                border
                ${card.border}

                bg-gradient-to-br
                ${card.glow}

                backdrop-blur-xl

                p-5

                transition-all
                duration-300

                hover:-translate-y-1
                hover:scale-[1.01]

                hover:shadow-[0_10px_40px_rgba(0,0,0,0.25)]
              `}
            >
              {/* =====================================
                  GLOW
              ===================================== */}

              <div
                className="
                  absolute
                  top-[-40px]
                  right-[-40px]

                  w-[120px]
                  h-[120px]

                  rounded-full

                  bg-white/5

                  blur-3xl

                  pointer-events-none
                "
              />

              {/* =====================================
                  TOP
              ===================================== */}

              <div
                className="
                  relative
                  z-10

                  flex
                  items-start
                  justify-between

                  mb-5
                "
              >
                {/* TEXT */}

                <div>
                  <p
                    className="
                      text-[11px]
                      uppercase
                      tracking-[0.18em]

                      text-[var(--text-secondary)]

                      font-semibold
                    "
                  >
                    {card.title}
                  </p>

                  <h2
                    className={`
                      mt-2

                      text-3xl
                      font-black
                      tracking-tight

                      ${
                        card.danger
                          ? "text-red-400"
                          : "text-[var(--text-primary)]"
                      }
                    `}
                  >
                    {card.value}
                  </h2>
                </div>

                {/* ICON */}

                <div
                  className="
                    w-12
                    h-12

                    rounded-2xl

                    flex
                    items-center
                    justify-center

                    bg-white/5

                    border
                    border-white/10

                    backdrop-blur-xl
                  "
                >
                  <Icon
                    size={22}
                    className={
                      card.iconColor
                    }
                  />
                </div>
              </div>

              {/* =====================================
                  FOOTER
              ===================================== */}

              <div
                className="
                  relative
                  z-10

                  flex
                  items-center
                  justify-between
                "
              >
                <p
                  className="
                    text-sm
                    text-[var(--text-secondary)]
                  "
                >
                  {card.subtitle}
                </p>

                <div
                  className="
                    h-[6px]
                    w-[6px]

                    rounded-full

                    bg-purple-300

                    shadow-[0_0_14px_rgba(168,85,247,0.8)]
                  "
                />
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default SummaryCards;