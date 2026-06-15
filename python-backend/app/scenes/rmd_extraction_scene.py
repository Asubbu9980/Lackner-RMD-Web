from manim import *
import json
import os

config.background_color = "#081229"


class RmdExtractionScene(Scene):

    def construct(self):

        # =====================================================
        # LOAD DATA
        # =====================================================

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

        # =====================================================
        # NORMALIZATION
        # =====================================================

        max_balance = max(balances)

        normalized_balances = [

            ((b / max_balance) * 8) + 0.5

            for b in balances
        ]

        normalized_rmds = [

            (r / max_balance) * 8

            for r in rmds
        ]

        # =====================================================
        # TITLE
        # =====================================================

        title = Text(
            "RMD Extraction Dynamics",
            font_size=36,
            color=WHITE
        )

        subtitle = Text(
            "Mandatory withdrawals weaken long-term wealth",
            font_size=18,
            color=PURPLE_C
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

        # =====================================================
        # TOTAL RMD CARD
        # =====================================================

        total_rmd = int(
            sum(rmds)
        )

        metric_title = Text(
            "Total Withdrawn",
            font_size=16,
            color=PURPLE_C
        )

        metric_value = Text(
            f"${total_rmd:,}",
            font_size=24,
            color=PURPLE_C
        )

        metric_group = VGroup(
            metric_title,
            metric_value
        ).arrange(DOWN)

        metric_group.scale(0.7)

        metric_group.to_corner(UR)

        self.play(
            FadeIn(metric_group),
            run_time=0.5
        )
                # =====================================================
        # AXES
        # =====================================================

        axes = Axes(
            x_range=[0, len(years) + 1, 5],
            y_range=[0, max(normalized_rmds) * 1.3, 1],
            axis_config={
                "include_numbers": False,
                "color": BLUE_E
            },
            x_length=11,
            y_length=5.5
        )

        axes.shift(DOWN * 0.4)

        self.play(Create(axes), run_time=0.8)

        # =====================================================
        # LARGE RMD BARS
        # =====================================================

        bars = VGroup()

        for i in range(len(years)):

            height = max(
                normalized_rmds[i],
                0.05
            )

            bar = Rectangle(
                width=0.22,
                height=height,
                fill_color=PURPLE_C,
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
                lag_ratio=0.015
            ),
            run_time=2
        )

        # =====================================================
        # PEAK RMD
        # =====================================================

        peak_index = rmds.index(max(rmds))

        peak_bar = bars[peak_index]

        peak_bar.set_fill(
            YELLOW,
            opacity=1
        )

        peak_label = Text(
            f"Peak RMD\n${int(max(rmds)):,}",
            font_size=20,
            color=YELLOW
        )

        peak_label.next_to(
            peak_bar,
            UP
        )

        self.play(
            Indicate(
                peak_bar,
                scale_factor=1.15
            ),
            FadeIn(peak_label),
            run_time=1
        )

        # =====================================================
        # ENDING VALUE
        # =====================================================

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
                color=GREEN_C
            )

        ).arrange(DOWN)

        value_group.scale(0.7)

        value_group.to_corner(DR)

        self.play(
            FadeIn(value_group),
            run_time=0.5
        )

        # =====================================================
        # SUMMARY
        # =====================================================

        summary_group = VGroup(

            Text(
                "RMD Impact",
                font_size=16,
                color=PURPLE_C
            ),

            Text(
                "Mandatory withdrawals\naccelerate portfolio decline.",
                font_size=12,
                color=GREY_A
            )

        ).arrange(
            DOWN,
            aligned_edge=LEFT
        )

        summary_group.scale(0.8)

        summary_group.to_corner(DL)

        self.play(
            FadeIn(summary_group),
            run_time=0.5
        )

        self.wait(1)