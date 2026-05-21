from manim import *
import json
import os

config.background_color = "#081229"


class TaxDrainScene(Scene):

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
        taxes = []

        for row in line_data:

            years.append(row["year"])

            balances.append(
                row["endBalance"]
            )

            taxes.append(
                row["tax"]
            )

        # =========================
        # NORMALIZATION
        # =========================

        max_balance = max(balances)

        normalized_balances = [

            ((b / max_balance) * 6) + 1

            for b in balances
        ]

        normalized_taxes = [

            (t / max_balance) * 9

            for t in taxes
        ]

        # =========================
        # TITLE
        # =========================

        title = Text(
            "Tax Drain Dynamics",
            font_size=42,
            color=WHITE
        )

        subtitle = Text(
            "Invisible tax erosion compounds over time",
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
            opacity=0.5
        )

        self.play(
            Create(balance_curve),
            run_time=4
        )

        # =========================
        # TAX STREAMS
        # =========================

        tax_streams = VGroup()

        for i in range(len(years)):

            height = max(
                normalized_taxes[i],
                0.05
            )

            stream = Rectangle(
                width=0.15,
                height=height,
                fill_color=RED_C,
                fill_opacity=0.85,
                stroke_width=0
            )

            glow = Rectangle(
                width=0.15,
                height=height,
                fill_color=RED_C,
                fill_opacity=0.15,
                stroke_width=0
            )

            glow.scale(1.8)

            stream.move_to(
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

            tax_streams.add(glow)
            tax_streams.add(stream)

        self.play(

            LaggedStart(
                *[
                    GrowFromEdge(
                        stream,
                        DOWN
                    )
                    for stream in tax_streams
                ],
                lag_ratio=0.02
            ),

            run_time=5
        )

        # =========================
        # LEAKING PARTICLES
        # =========================

        particles = VGroup()

        for i in range(0, len(curve_points), 2):

            particle = Dot(
                curve_points[i],
                radius=0.05,
                color=RED_A
            )

            particles.add(particle)

        self.play(

            LaggedStart(
                *[
                    particle.animate.shift(
                        DOWN * 2.5 +
                        RIGHT * 0.3
                    )
                    for particle in particles
                ],
                lag_ratio=0.04
            ),

            run_time=5
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
            radius=0.25,
            color=WHITE,
            fill_opacity=0.15
        )

        self.play(
            FadeIn(glow_tracker),
            FadeIn(tracker)
        )

        # =========================
        # TRACKER EVOLUTION
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

            if i > len(curve_points) * 0.65:

                tracker_color = RED_C

                glow_opacity = 0.08

            else:

                tracker_color = WHITE

                glow_opacity = 0.15

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
        # TAX PULSE
        # =========================

        self.play(
            tax_streams.animate.scale(1.05),
            run_time=0.5
        )

        self.play(
            tax_streams.animate.scale(0.95),
            run_time=0.5
        )

        # =========================
        # FINAL WARNING
        # =========================

        final_text = Text(
            "Tax drag silently compounds\nacross retirement decades.",
            font_size=28,
            color=WHITE
        )

        final_text.to_edge(DOWN)

        self.play(
            Write(final_text),
            run_time=3
        )

        self.wait(4)