def create_narration(
    chart_data,
    scene_type
):

    rows = chart_data["lineChart"]

    total_rmd = sum(
        row["rmd"]
        for row in rows
    )

    total_tax = sum(
        row["tax"]
        for row in rows
    )

    peak_balance = max(
        row["endBalance"]
        for row in rows
    )

    ending_balance = rows[-1]["endBalance"]

    if scene_type == "projection":

        return f"""
        Welcome to your retirement analysis.

        Peak portfolio value reached
        {peak_balance:,.0f} dollars.

        Lifetime distributions totaled
        {total_rmd:,.0f} dollars.

        The projection ended with
        {ending_balance:,.0f} dollars remaining.
        """

    elif scene_type == "rmd":

        peak_rmd = max(
            row["rmd"]
            for row in rows
        )

        return f"""
        This analysis focuses on required minimum distributions.

        Lifetime withdrawals exceeded
        {total_rmd:,.0f} dollars.

        The largest annual withdrawal reached
        {peak_rmd:,.0f} dollars.

        RMD's reduced wealth to {ending_balance:,.0f} dollars.
        """

    elif scene_type == "tax":

        peak_tax = max(
            row["tax"]
            for row in rows
        )

        return f"""
        This analysis focuses on tax impact.

        Total taxes exceeded
        {total_tax:,.0f} dollars.

        The largest annual tax payment reached
        {peak_tax:,.0f} dollars.

        Tax drag significantly reduced portfolio growth.
        """

    elif scene_type == "collapse":

        years = len(rows)

        return f"""
        This analysis focuses on portfolio sustainability.

        Peak wealth reached
        {peak_balance:,.0f} dollars.

        The portfolio remained active for
        {years} years.

        Increasing withdrawals eventually depleted retirement assets.
        """

    return "Retirement analysis complete."