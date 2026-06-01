def create_narration(chart_data):

    rows = chart_data["lineChart"]

    total_rmd = sum(row["rmd"] for row in rows)

    peak_balance = max(
        row["endBalance"]
        for row in rows
    )

    ending_balance = rows[-1]["endBalance"]

    return f"""
    Welcome to your retirement portfolio analysis.

    Peak portfolio value reached {peak_balance:,.0f} dollars.

    Lifetime withdrawals totaled {total_rmd:,.0f} dollars.

    The projection ended with {ending_balance:,.0f} dollars remaining.
    """