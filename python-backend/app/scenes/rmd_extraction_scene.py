from manim import *
import json
import os

config.background_color = "#081229"


class RmdExtractionScene(Scene):

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
        rmds = []

        for row in line_data:

            years.append(row["year"])

            balances.append(
                row["endBalance"]
            )

            rmds.append(
                row["rmd"]
            )

        # =========================
        # NORMALIZATION
        # =========================

        max_balance = max(balances)

        normalized_balances = [
            ((b / max_balance) * 6) + 1
            for b in balances
        ]

        normalized_rmds = [
            (r / max_balance) * 8
            for r in rmds
        ]

        # =========================
        # TITLE
        # =========================

        title = Text(
            "RMD Extraction Dynamics",
            font_size=42,
            color=WHITE
        )

        subtitle = Text(
            "Mandatory withdrawals weaken long-term wealth",
            font_size=22,
            color=PURPLE_C
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
                "color": BLUE_E
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
        # BALANCE CURVE
        # =========================

        curve_points = [

            axes.c2p(i+1, y)

            for i, y in enumerate(
                normalized_balances
            )
        ]

        balance_curve = VMobject()

        balance_curve.set_points_smoothly(
            curve_points
        )

        balance_curve.set_stroke(
            BLUE_C,
            width=4,
            opacity=0.4
        )

        self.play(
            Create(balance_curve),
            run_time=4
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
        # RMD EXTRACTION BARS
        # =========================

        bars = VGroup()

        for i in range(len(years)):

            height = max(
                normalized_rmds[i],
                0.05
            )

            bar = Rectangle(
                width=0.18,
                height=height,
                fill_color=PURPLE_C,
                fill_opacity=0.85,
                stroke_width=0
            )

            glow = Rectangle(
                width=0.18,
                height=height,
                fill_color=PURPLE_C,
                fill_opacity=0.15,
                stroke_width=0
            )

            glow.scale(1.6)

            bar.move_to(
                axes.c2p(
                    i+1,
                    height / 2
                )
            )

            glow.move_to(
                axes.c2p(
                    i+1,
                    height / 2
                )
            )

            bars.add(glow)
            bars.add(bar)

        self.play(

            LaggedStart(
                *[
                    GrowFromEdge(
                        bar,
                        DOWN
                    )
                    for bar in bars
                ],
                lag_ratio=0.02
            ),

            run_time=5
        )

        # =========================
        # EXTRACTION PARTICLES
        # =========================

        particles = VGroup()

        for i in range(0, len(years), 2):

            particle = Dot(
                axes.c2p(
                    i+1,
                    normalized_balances[i]
                ),
                radius=0.05,
                color=PURPLE_A
            )

            particles.add(particle)

        self.play(
            LaggedStart(
                *[
                    particle.animate.shift(
                        DOWN * 2
                    )
                    for particle in particles
                ],
                lag_ratio=0.05
            ),
            run_time=4
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
            radius=0.25,
            color=WHITE,
            fill_opacity=0.15
        )

        self.play(
            FadeIn(glow_tracker),
            FadeIn(tracker)
        )

        # =========================
        # TRACKER ANIMATION
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

            if i > len(curve_points) * 0.6:

                color = RED_C

            else:

                color = WHITE

            self.play(

                tracker.animate
                .move_to(curve_points[i])
                .set_color(color),

                glow_tracker.animate
                .move_to(curve_points[i])
                .set_color(color),

                Transform(
                    year_text,
                    year_update
                ),

                run_time=0.12
            )

        # =========================
        # FINAL MESSAGE
        # =========================

        final_text = Text(
            "RMD extractions accelerate\nportfolio depletion.",
            font_size=28,
            color=WHITE
        )

        final_text.to_edge(DOWN)

        self.play(
            Write(final_text),
            run_time=3
        )

        self.wait(4)