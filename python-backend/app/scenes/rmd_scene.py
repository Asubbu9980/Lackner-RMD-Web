from manim import *
import json
import os
import numpy as np

config.background_color = "#081229"


class RmdGrowthScene(Scene):

    def construct(self):

        # ======================================================
        # LOAD DATA
        # ======================================================

        data_file = os.environ.get("RENDER_DATA_FILE")

        with open(data_file, "r") as file:
            chart_data = json.load(file)

        line_data = chart_data["lineChart"]

        years = []
        balances = []
        growths = []
        rmds = []
        taxes = []

        for row in line_data:

            years.append(row["year"])
            balances.append(row["endBalance"])
            growths.append(row["growth"])
            rmds.append(row["rmd"])
            taxes.append(row["tax"])

        # ======================================================
        # NORMALIZATION
        # ======================================================

        normalized_years = [
            i + 1
            for i in range(len(years))
        ]

        max_balance = max(balances)

        normalized_balances = [

            ((b / max_balance) * 8.2) + 0.35

            for b in balances
        ]

        normalized_growths = [

            (g / max_balance) * 7

            for g in growths
        ]

        normalized_rmds = [

            (r / max_balance) * 7

            for r in rmds
        ]

        normalized_taxes = [

            (t / max_balance) * 7

            for t in taxes
        ]

        # ======================================================
        # BACKGROUND
        # ======================================================

        background = Rectangle(
            width=20,
            height=12,
            fill_opacity=1,
            stroke_width=0
        )

        background.set_color_by_gradient(
            "#081229",
            "#0B1F3A"
        )

        self.add(background)

        # ======================================================
        # TITLE
        # ======================================================

        title = Text(

            "RMD Portfolio Evolution",

            font_size=36,

            color=WHITE

        )

        subtitle = Text(

            "3Blue1Brown Style Analytics",

            font_size=18,

            color=BLUE_C

        )

        subtitle.next_to(title, DOWN)

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


        # ======================================================
        # TOTAL WITHDRAWN
        # ======================================================

        total_rmd_value = int(sum(rmds))

        counter_title = Text(

            "Total Withdrawn",

            font_size=16,

            color=PURPLE_C

        )

        counter_text = Text(

            f"${total_rmd_value:,}",

            font_size=24,

            color=PURPLE_C

        )

        counter_group = VGroup(
            counter_title,
            counter_text
        ).arrange(DOWN)

        counter_group.scale(0.7)

        counter_group.to_corner(UR)

        self.play(
            FadeIn(counter_group),
            run_time=0.5
        )

        # ======================================================
        # AXES
        # ======================================================

        axes = Axes(

            x_range=[
                0,
                len(normalized_years) + 1,
                5
            ],

            y_range=[
                0,
                10,
                2
            ],

            axis_config={

                "include_numbers": False,

                "color": BLUE_E,

                "stroke_opacity": 0.5
            },

            x_length=11,

            y_length=5
        )

        axes.shift(DOWN * 0.9)

        self.play(

            Create(axes),

            run_time=0.8
        )

        # ======================================================
        # CURVE POINTS
        # ======================================================

        curve_points = [

            axes.c2p(x, y)

            for x, y in zip(
                normalized_years,
                normalized_balances
            )
        ]

        # ======================================================
        # MAIN CURVE
        # ======================================================

        curve = VMobject()

        curve.set_points_smoothly(curve_points)

        curve.set_stroke(
            width=5
        )

        curve.set_color_by_gradient(
            BLUE_C,
        )

        self.play(

            Create(curve),

            run_time=2
        )

        # ======================================================
        # PEAK POINT
        # ======================================================

        peak_index = balances.index(max(balances))

        peak_point = axes.c2p(

            normalized_years[peak_index],

            normalized_balances[peak_index]
        )

        peak_dot = Dot(

            peak_point,

            radius=0.08,

            color=YELLOW
        )

        peak_label = Text(

            "Peak Wealth",

            font_size=14,

            color=YELLOW
        )

        peak_label.next_to(
            peak_dot,
            UP
        )

        self.play(

            FadeIn(peak_dot),

            Write(peak_label),

            run_time=0.5
        )

        # ======================================================
        # PEAK PULSE
        # ======================================================

        self.play(

            peak_dot.animate.scale(1.2),

            run_time=0.2
        )

        self.play(

            peak_dot.animate.scale(0.83),

            run_time=0.2
        )

        # ======================================================
        # TRACKER
        # ======================================================

        tracker_dot = Dot(

            curve_points[0],

            radius=0.10,

            color=WHITE
        )

        tracker_glow = Dot(

            curve_points[0],

            radius=0.18,

            color=WHITE,

            fill_opacity=0.08
        )

        self.play(

            FadeIn(tracker_glow),

            FadeIn(tracker_dot),

            run_time=0.4
        )

        # ======================================================
        # BARS
        # ======================================================

        growth_bars = VGroup()

        rmd_bars = VGroup()

        tax_bars = VGroup()

        for i in range(0, len(normalized_years), 2):

            x = normalized_years[i]

            growth_height = max(
                normalized_growths[i],
                0.02
            )

            rmd_height = max(
                normalized_rmds[i],
                0.02
            )

            tax_height = max(
                normalized_taxes[i],
                0.02
            )

            # ==================================================
            # GROWTH BAR
            # ==================================================

            growth_bar = Rectangle(

                width=0.12,

                height=growth_height,

                fill_color=GREEN_C,

                fill_opacity=0.8,

                stroke_width=0
            )

            growth_bar.move_to(

                axes.c2p(
                    x - 0.18,
                    growth_height / 2
                )
            )

            growth_bars.add(growth_bar)

            # ==================================================
            # RMD BAR
            # ==================================================

            rmd_bar = Rectangle(

                width=0.12,

                height=rmd_height,

                fill_color=PURPLE_C,

                fill_opacity=0.9,

                stroke_width=0
            )

            rmd_bar.move_to(

                axes.c2p(
                    x,
                    rmd_height / 2
                )
            )

            rmd_bars.add(rmd_bar)

            # ==================================================
            # TAX BAR
            # ==================================================

            tax_bar = Rectangle(

                width=0.12,

                height=tax_height,

                fill_color=RED_C,

                fill_opacity=0.85,

                stroke_width=0
            )

            tax_bar.move_to(

                axes.c2p(
                    x + 0.18,
                    tax_height / 2
                )
            )

            tax_bars.add(tax_bar)

        # ======================================================
        # BARS ANIMATION
        # ======================================================

        self.play(

            LaggedStart(

                *[
                    GrowFromEdge(
                        bar,
                        DOWN
                    )

                    for bar in growth_bars
                ],

                lag_ratio=0.01
            ),

            run_time=0.8
        )

        self.play(

            LaggedStart(

                *[
                    GrowFromEdge(
                        bar,
                        DOWN
                    )

                    for bar in rmd_bars
                ],

                lag_ratio=0.01
            ),

            run_time=0.8
        )

        self.play(

            LaggedStart(

                *[
                    GrowFromEdge(
                        bar,
                        DOWN
                    )

                    for bar in tax_bars
                ],

                lag_ratio=0.01
            ),

            run_time=0.8
        )

        # ======================================================
        # TRACKER PATH
        # ======================================================

        path = VMobject()

        path.set_points_smoothly(curve_points)

        self.play(

            MoveAlongPath(
                tracker_dot,
                path
            ),

            MoveAlongPath(
                tracker_glow,
                path
            ),

            run_time=2.5,

            rate_func=linear
        )

        # ======================================================
        # ENDING VALUE
        # ======================================================

        portfolio_value = balances[-1]

        value_title = Text(

            "Ending Portfolio Value",

            font_size=16,

            color=WHITE
        )

        value_text = Text(

            f"${int(portfolio_value):,}",

            font_size=24,

            color=GREEN_C
        )

        value_group = VGroup(
            value_title,
            value_text
        ).arrange(DOWN)

        value_group.scale(0.7)

        value_group.shift(
            RIGHT * 4.8 +
            UP * 2.3
        )

        self.play(
            FadeIn(value_group),
            run_time=0.5
        )

        # ======================================================
        # ANALYSIS
        # ======================================================

        summary_title = Text(

            "Portfolio Stress Analysis",

            font_size=16,

            color=PURPLE_C
        )

        summary_text = Text(

            "RMD extraction accelerates\nwealth depletion over time.",

            font_size=12,

            color=GREY_A
        )

        summary_group = VGroup(

            summary_title,

            summary_text

        ).arrange(
            DOWN,
            aligned_edge=LEFT
        )

        summary_group.scale(0.8)

        summary_group.shift(

            RIGHT * 4.6 +

            DOWN * 2.3
        )

        self.play(

            FadeIn(summary_group),

            run_time=0.5
        )

        # ======================================================
        # FINAL HOLD
        # ======================================================

        self.wait(1)