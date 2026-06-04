from manim import *
import json
import os

config.background_color = "#050816"


class PortfolioCollapseScene(Scene):

    def construct(self):

        # =========================
        # LOAD DATA
        # =========================

        data_file = os.environ.get(
            "RENDER_DATA_FILE"
        )

        with open(data_file, "r") as file:
            chart_data = json.load(file)

        line_data = chart_data["lineChart"]

        years = []
        balances = []

        for row in line_data:

            years.append(row["year"])

            balances.append(
                row["endBalance"]
            )

        # =========================
        # NORMALIZATION
        # =========================

        max_balance = max(balances)

        normalized_balances = [

            (b / max_balance) * 5.5

            for b in balances
        ]

        # =========================
        # TITLE
        # =========================

        title = Text(
            "Portfolio Collapse Dynamics",
            font_size=34,
            color=WHITE
        )

        subtitle = Text(
            "Retirement depletion accelerates over time",
            font_size=16,
            color=RED_C
        )

        subtitle.next_to(
            title,
            DOWN
        )

        self.play(
            FadeIn(title),
            FadeIn(subtitle),
            run_time=1
        )

        self.play(
            VGroup(
                title,
                subtitle
            ).animate.to_edge(UP),
            run_time=0.5
        )

        # =========================
        # AXES
        # =========================

        axes = Axes(
            x_range=[0, len(years)+1, 5],
            y_range=[0, 10, 2],
            axis_config={
                "include_numbers": False,
                "color": GREY_E
            },
            x_length=11,
            y_length=5
        )

        

        self.play(
            Create(axes),
            run_time=0.8
        )

                # =========================
        # PORTFOLIO BARS
        # =========================

        bars = VGroup()

        for i in range(len(years)):

            height = max(
                normalized_balances[i],
                0.05
            )

            if i < len(years) * 0.4:

                color = BLUE_C

            elif i < len(years) * 0.7:

                color = YELLOW_C

            else:

                color = RED_C

            bar = Rectangle(
                width=0.22,
                height=height,
                fill_color=color,
                fill_opacity=0.9,
                stroke_width=0
            )

            bar.move_to(
                axes.c2p(
                    i + 1,
                    height / 2
                )
            )

            bars.add(bar)

        self.play(
            LaggedStart(
                *[
                    GrowFromEdge(bar, DOWN)
                    for bar in bars
                ],
                lag_ratio=0.03
            ),
            run_time=2
        )

        peak_index = balances.index(
            max(balances)
        )

        peak_balance = int(
            max(balances)
        )

        peak_bar = bars[peak_index]

        peak_bar.set_fill(
            GREEN_C,
            opacity=1
        )

        peak_label = Text(
            f"Peak Wealth\n${peak_balance:,}",
            font_size=14,
            color=GREEN_C
        )

        peak_label.next_to(
            peak_bar,
            UP
        )

        peak_label.scale(0.75)
    

        self.play(
            Indicate(
                peak_bar
            ),
            FadeIn(
                peak_label
            ),
            run_time=1
        )

        lifespan_group = VGroup(

            Text(
                "Portfolio Lifespan",
                font_size=16,
                color=RED_C
            ),

            Text(
                f"{len(years)} Years",
                font_size=24,
                color=RED_C
            )

        ).arrange(DOWN)

        lifespan_group.scale(0.7)

        lifespan_group.to_corner(UR)

        self.play(
            FadeIn(lifespan_group),
            run_time=0.5
        )

        

        # =========================
        # DEPLETION WARNING
        # =========================

        ending_balance = int(
            balances[-1]
        )

        value_group = VGroup(

            Text(
                "Ending Portfolio",
                font_size=16,
                color=WHITE
            ),

            Text(
                f"${ending_balance:,}",
                font_size=24,
                color=RED_C
            )

        ).arrange(DOWN)

        value_group.scale(0.7)

        value_group.to_corner(DR)

        self.play(
            FadeIn(value_group),
            run_time=0.5
        )

        summary_group = VGroup(

            Text(
                "Collapse Risk",
                font_size=16,
                color=RED_C
            ),

            Text(
                "Withdrawals eventually\noutpace portfolio growth.",
                font_size=12,
                color=GREY_A
            )

        ).arrange(
            DOWN,
            aligned_edge=LEFT
        )

        summary_group.scale(0.8)

        summary_group.next_to(
            value_group,
            UP,
            buff=0.8
        )

        self.play(
            FadeIn(summary_group),
            run_time=0.5
        )

        self.wait(7)

        
