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

        data_file = os.environ.get(
            "RENDER_DATA_FILE"
        )

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

            balances.append(
                row["endBalance"]
            )

            growths.append(
                row["growth"]
            )

            rmds.append(
                row["rmd"]
            )

            taxes.append(
                row["tax"]
            )

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
        # BACKGROUND GLOW
        # ======================================================

        background_glow = Rectangle(

            width=20,
            height=12,

            fill_color=BLUE_E,
            fill_opacity=0.05,

            stroke_width=0

        )

        self.add(background_glow)

        # ======================================================
        # TITLE
        # ======================================================

        title = Text(

            "RMD Portfolio Evolution",

            font_size=42,

            color=WHITE

        )

        subtitle = Text(

            "3Blue1Brown Style Analytics",

            font_size=24,

            color=BLUE_C

        )

        subtitle.next_to(
            title,
            DOWN
        )

        self.play(

            FadeIn(title),

            FadeIn(subtitle),

            run_time=5
        )

        self.wait(0.5)

        self.play(

            VGroup(
                title,
                subtitle
            ).animate.to_edge(UP),

            run_time=1.5
        )

        # ======================================================
        # YEAR DISPLAY
        # ======================================================

        year_text = Text(

            str(years[0]),

            font_size=34,

            color=GREY_B

        )

        year_text.to_corner(UL)

        self.play(
            FadeIn(year_text),
            run_time=1
        )

        # ======================================================
        # LIVE RMD COUNTER
        # ======================================================

        counter_title = Text(

            "Total Withdrawn",

            font_size=20,

            color=PURPLE_C

        )

        counter_text = Text(

            "$0",

            font_size=30,

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
            run_time=1.5
        )

        # ======================================================
        # GRID
        # ======================================================

        grid = NumberPlane(

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

            background_line_style={

                "stroke_color": BLUE_E,

                "stroke_opacity": 0.08,

                "stroke_width": 1
            },

            x_length=11,

            y_length=5

        )

        grid.shift(DOWN * 0.9)

        self.play(
            FadeIn(grid),
            run_time=2
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

                "color": BLUE_E
            },

            x_length=11,

            y_length=5
        )

        axes.shift(DOWN * 0.9)

        axes_glow = axes.copy()

        axes_glow.set_stroke(

            BLUE_C,

            width=3,

            opacity=0.2
        )

        self.play(

            Create(axes),

            FadeIn(axes_glow),

            run_time=2
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

        curve_segments = VGroup()

        for i in range(len(curve_points) - 1):

            start = curve_points[i]

            end = curve_points[i + 1]

            progress = i / len(curve_points)

            if progress < 0.35:

                color = BLUE_C

            elif progress < 0.65:

                color = YELLOW_C

            else:

                color = RED_C

            glow_segment = Line(

                start,
                end,

                stroke_width=18,

                color=color,

                stroke_opacity=0.12
            )

            segment = Line(

                start,
                end,

                stroke_width=5,

                color=color
            )

            curve_segments.add(glow_segment)

            curve_segments.add(segment)

        self.play(

            LaggedStart(

                *[
                    Create(segment)
                    for segment in curve_segments
                ],

                lag_ratio=0.015
            ),

            run_time=6
        )

        # ======================================================
        # PEAK HIGHLIGHT
        # ======================================================

        peak_index = balances.index(
            max(balances)
        )

        peak_point = axes.c2p(

            normalized_years[peak_index],

            normalized_balances[peak_index]
        )

        peak_glow = Dot(

            peak_point,

            radius=0.35,

            color=YELLOW,

            fill_opacity=0.15
        )

        peak_dot = Dot(

            peak_point,

            radius=0.10,

            color=YELLOW
        )

        peak_label = Text(

            "Peak Wealth",

            font_size=18,

            color=YELLOW
        )

        peak_label.next_to(
            peak_dot,
            UP
        )

        self.play(

            FadeIn(peak_glow),

            FadeIn(peak_dot),

            Write(peak_label),

            run_time=1.5
        )

        # ======================================================
        # TRACKER
        # ======================================================

        tracker_dot = Dot(

            curve_points[0],

            radius=0.12,

            color=WHITE
        )

        tracker_glow = Dot(

            curve_points[0],

            radius=0.24,

            color=WHITE,

            fill_opacity=0.15
        )

        self.play(

            FadeIn(tracker_glow),

            FadeIn(tracker_dot),

            run_time=1
        )

        # ======================================================
        # BARS
        # ======================================================

        growth_bars = VGroup()

        rmd_bars = VGroup()

        tax_bars = VGroup()

        extraction_beams = VGroup()

        particle_group = VGroup()

        for i in range(len(normalized_years)):

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

                width=0.10,

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

                width=0.10,

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

                width=0.10,

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

            # ==================================================
            # EXTRACTION BEAMS
            # ==================================================

            beam = Line(

                curve_points[i],

                axes.c2p(x, rmd_height),

                color=PURPLE_C,

                stroke_width=2,

                stroke_opacity=0.22
            )

            extraction_beams.add(beam)

            # ==================================================
            # PARTICLES
            # ==================================================

            particle = Dot(

                curve_points[i],

                radius=0.04,

                color=PURPLE_A
            )

            particle_group.add(particle)

        # ======================================================
        # GROWTH BARS
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

            run_time=2
        )

        # ======================================================
        # RMD EXTRACTION
        # ======================================================

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

            FadeIn(extraction_beams),

            run_time=3
        )

        # ======================================================
        # TAX BARS
        # ======================================================

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

            run_time=2
        )

        # ======================================================
        # TRACKER TIMELINE
        # ======================================================

        total_rmd = 0

        for i in range(len(curve_points)):

            next_position = curve_points[i]

            progress = i / len(curve_points)

            total_rmd += rmds[i]

            year_update = Text(

                str(years[i]),

                font_size=34,

                color=GREY_B
            )

            year_update.move_to(
                year_text
            )

            counter_update = Text(

                f"${int(total_rmd):,}",

                font_size=30,

                color=PURPLE_C
            )

            counter_update.move_to(
                counter_text
            )

            if progress < 0.35:

                tracker_color = BLUE_C

            elif progress < 0.65:

                tracker_color = YELLOW_C

            else:

                tracker_color = RED_C

            # ==================================================
            # PARTICLE FLOW
            # ==================================================

            particle_animation = particle_group[i].animate.move_to(

                axes.c2p(
                    normalized_years[i],
                    normalized_rmds[i]
                )
            )

            # ==================================================
            # PORTFOLIO STRESS
            # ==================================================

            if progress > 0.72:

                stress_flash = Flash(

                    tracker_dot,

                    color=RED_C,

                    line_length=0.2,

                    flash_radius=0.35
                )

                self.play(stress_flash, run_time=0.2)

            self.play(

                tracker_dot.animate
                .move_to(next_position)
                .set_color(tracker_color),

                tracker_glow.animate
                .move_to(next_position)
                .set_color(tracker_color),

                particle_animation,

                Transform(
                    year_text,
                    year_update
                ),

                Transform(
                    counter_text,
                    counter_update
                ),

                run_time=0.15
            )

        # ======================================================
        # CURVE WEAKENING
        # ======================================================

        self.play(

            curve_segments.animate.set_opacity(0.45),

            run_time=2
        )

        # ======================================================
        # TAX PULSE
        # ======================================================

        self.play(

            tax_bars.animate.scale(1.08),

            run_time=0.4
        )

        self.play(

            tax_bars.animate.scale(0.92),

            run_time=0.4
        )

        # ======================================================
        # FINAL VALUE
        # ======================================================

        portfolio_value = balances[-1]

        value_title = Text(

            "Ending Portfolio Value",

            font_size=18,

            color=WHITE
        )

        value_text = Text(

            f"${int(portfolio_value):,}",

            font_size=28,

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
            run_time=1.5
        )

        # ======================================================
        # LEGEND
        # ======================================================

        legend = VGroup(

            VGroup(

                Square(
                    side_length=0.15,
                    fill_color=BLUE_C,
                    fill_opacity=1,
                    stroke_width=0
                ),

                Text(
                    "Balance",
                    font_size=18
                )

            ).arrange(RIGHT),

            VGroup(

                Square(
                    side_length=0.15,
                    fill_color=GREEN_C,
                    fill_opacity=1,
                    stroke_width=0
                ),

                Text(
                    "Growth",
                    font_size=18
                )

            ).arrange(RIGHT),

            VGroup(

                Square(
                    side_length=0.15,
                    fill_color=PURPLE_C,
                    fill_opacity=1,
                    stroke_width=0
                ),

                Text(
                    "RMD",
                    font_size=18
                )

            ).arrange(RIGHT),

            VGroup(

                Square(
                    side_length=0.15,
                    fill_color=RED_C,
                    fill_opacity=1,
                    stroke_width=0
                ),

                Text(
                    "Tax",
                    font_size=18
                )

            ).arrange(RIGHT),

        ).arrange(
            RIGHT,
            buff=0.5
        )

        legend.scale(0.65)

        legend.shift(
            DOWN * 3.15
        )

        self.play(
            FadeIn(legend),
            run_time=1.5
        )

        # ======================================================
        # FINAL SUMMARY
        # ======================================================

        summary_title = Text(

            "Portfolio Stress Analysis",

            font_size=22,

            color=PURPLE_C
        )

        summary_text = Text(

            "RMD extraction accelerates\nwealth depletion over time.",

            font_size=18,

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

            run_time=2
        )

        # ======================================================
        # FINAL HOLD
        # ======================================================

        self.wait(4)