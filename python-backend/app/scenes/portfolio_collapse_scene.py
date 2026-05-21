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

            ((b / max_balance) * 6) + 1

            for b in balances
        ]

        # =========================
        # TITLE
        # =========================

        title = Text(
            "Portfolio Collapse Dynamics",
            font_size=42,
            color=WHITE
        )

        subtitle = Text(
            "Retirement depletion accelerates over time",
            font_size=22,
            color=RED_C
        )

        subtitle.next_to(
            title,
            DOWN
        )

        self.play(
            FadeIn(title),
            FadeIn(subtitle),
            run_time=2
        )

        self.play(
            VGroup(
                title,
                subtitle
            ).animate.to_edge(UP),
            run_time=2
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

        axes.shift(DOWN)

        self.play(
            Create(axes),
            run_time=2
        )

        # =========================
        # CURVE POINTS
        # =========================

        curve_points = [

            axes.c2p(i+1, y)

            for i, y in enumerate(
                normalized_balances
            )
        ]

        # =========================
        # COLLAPSE CURVE
        # =========================

        curve_segments = VGroup()

        for i in range(len(curve_points) - 1):

            start = curve_points[i]
            end = curve_points[i + 1]

            progress = i / len(curve_points)

            if progress < 0.4:

                color = BLUE_C

            elif progress < 0.7:

                color = YELLOW_C

            else:

                color = RED_C

            glow_segment = Line(
                start,
                end,
                stroke_width=18,
                color=color,
                stroke_opacity=0.18
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
                lag_ratio=0.02
            ),

            run_time=7
        )

        # =========================
        # YEAR DISPLAY
        # =========================

        year_text = Text(
            str(years[0]),
            font_size=34,
            color=GREY_B
        )

        year_text.to_corner(UL)

        self.play(
            FadeIn(year_text)
        )

        # =========================
        # TRACKER
        # =========================

        tracker = Dot(
            curve_points[0],
            radius=0.12,
            color=WHITE
        )

        glow_tracker = Dot(
            curve_points[0],
            radius=0.30,
            color=WHITE,
            fill_opacity=0.15
        )

        self.play(
            FadeIn(glow_tracker),
            FadeIn(tracker)
        )

        # =========================
        # COLLAPSE MOTION
        # =========================

        for i in range(len(curve_points)):

            year_update = Text(
                str(years[i]),
                font_size=34,
                color=GREY_B
            )

            year_update.move_to(
                year_text
            )

            progress = i / len(curve_points)

            # COLOR EVOLUTION

            if progress < 0.4:

                tracker_color = BLUE_C
                glow_opacity = 0.18

            elif progress < 0.7:

                tracker_color = YELLOW_C
                glow_opacity = 0.12

            else:

                tracker_color = RED_C
                glow_opacity = 0.05

            self.play(

                tracker.animate
                .move_to(curve_points[i])
                .set_color(tracker_color),

                glow_tracker.animate
                .move_to(curve_points[i])
                .set_color(tracker_color)
                .set_opacity(glow_opacity),

                Transform(
                    year_text,
                    year_update
                ),

                run_time=0.12
            )

        # =========================
        # COLLAPSE WAVE
        # =========================

        collapse_wave = Circle(
            radius=0.3,
            color=RED_C,
            stroke_width=6
        )

        collapse_wave.move_to(
            curve_points[-1]
        )

        self.play(
            GrowFromCenter(
                collapse_wave
            ),
            run_time=1.5
        )

        self.play(
            collapse_wave.animate.scale(8)
            .set_opacity(0),
            run_time=3
        )

        # =========================
        # FINAL IMPLOSION
        # =========================

        final_flash = Dot(
            curve_points[-1],
            radius=0.4,
            color=RED_C
        )

        self.play(
            FadeIn(final_flash),
            run_time=0.5
        )

        self.play(
            final_flash.animate.scale(4)
            .set_opacity(0),
            run_time=2
        )

        # =========================
        # DEPLETION WARNING
        # =========================

        warning = Text(
            "Portfolio depletion risk\nbecomes severe in later years.",
            font_size=30,
            color=WHITE
        )

        warning.to_edge(DOWN)

        self.play(
            Write(warning),
            run_time=3
        )

        # =========================
        # FINAL DIM
        # =========================

        self.play(

            FadeOut(glow_tracker),

            tracker.animate.set_opacity(0.2),

            run_time=3
        )

        self.wait(4)