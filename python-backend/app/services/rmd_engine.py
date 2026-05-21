from app.services.life_tables import (
    TABLE_I_SINGLE,
    TABLE_III_UNIFORM
)

from app.services.helpers import (
    get_rbd_age
)


def calculate_schedule(inputs: dict):

    # =====================================
    # SETUP
    # =====================================

    rows = []

    max_years = 50

    balance = float(
        inputs["balance_Start"]
    )

    growth_rate = (
        float(inputs["growth_Rate"]) / 100
    )

    tax_rate = (
        float(inputs["tax_Rate"]) / 100
    )

    birth_owner = int(
        inputs["year_Birth_Owner"]
    )

    scenario = (
        inputs.get("scenario")
        or "LIVING_UNIFORM"
    )

    # =====================================
    # START AGE / YEAR
    # =====================================

    start_age = int(
        get_rbd_age(birth_owner)
    )

    start_year = (
        birth_owner + start_age
    )

    # =====================================
    # CUMULATIVE TRACKING
    # =====================================

    cum_rmd = 0
    cum_tax = 0
    cum_growth = 0

    # =====================================
    # FACTOR HELPERS
    # =====================================

    def get_uniform_factor(age):

        return TABLE_III_UNIFORM.get(
            age,
            TABLE_III_UNIFORM[120]
        )

    def get_single_factor(age):

        return TABLE_I_SINGLE.get(
            age,
            TABLE_I_SINGLE[100]
        )

    # =====================================
    # MAIN LOOP
    # =====================================

    for i in range(max_years):

        age = start_age + i

        year = start_year + i

        # MATCH NODE LOGIC
        if balance <= 1000:
            break

        # =================================
        # SCENARIO HANDLING
        # =================================

        if scenario == "LIVING_UNIFORM":

            factor = get_uniform_factor(age)

        elif scenario == "LIVING_JOINT":

            factor = (
                get_uniform_factor(age) + 2
            )

        elif scenario == "DECEASED_SPOUSE_INHERIT":

            factor = (
                get_uniform_factor(age) + 1.5
            )

        elif scenario == "DECEASED_EDB_SINGLELIFE":

            factor = get_single_factor(age)

        elif scenario == "DECEASED_10YEAR":

            year_index = i + 1

            if year_index < 10:

                factor = float("inf")

            else:

                factor = 1

        elif scenario == "DECEASED_10YEAR_ANNUAL":

            start_factor = get_single_factor(
                start_age
            )

            factor = max(
                start_factor - i,
                1
            )

        else:

            factor = get_uniform_factor(age)

        # =================================
        # RMD
        # =================================

        if factor == float("inf"):

            rmd = 0

        else:

            rmd = balance / factor

        rmd = min(rmd, balance)

        # =================================
        # TAX / GROWTH
        # =================================

        tax = rmd * tax_rate

        net = rmd - tax

        after_rmd = balance - rmd

        growth = after_rmd * growth_rate

        end_balance = (
            after_rmd + growth
        )

        # =================================
        # CUMULATIVE
        # =================================

        cum_rmd += rmd

        cum_tax += tax

        cum_growth += growth

        # =================================
        # ROW
        # =================================

        rows.append({

            "yr": i + 1,

            "year": year,

            "age": age,

            "factor": (
                None
                if factor == float("inf")
                else round(factor, 1)
            ),

            "beginBalance": round(balance, 2),

            "rmd": round(rmd, 2),

            "tax": round(tax, 2),

            "net": round(net, 2),

            "growth": round(growth, 2),

            "endBalance": round(end_balance, 2),

            "cumRmd": round(cum_rmd, 2),

            "cumTax": round(cum_tax, 2),

            "cumGrowth": round(cum_growth, 2)
        })

        balance = end_balance

    # =====================================
    # FINAL RESPONSE
    # =====================================

    return {

        "balanceStart":
        inputs["balance_Start"],

        "totalRmd":
        round(cum_rmd, 2),

        "totalTax":
        round(cum_tax, 2),

        "totalGrowth":
        round(cum_growth, 2),

        "endingBalance":
        round(balance, 2),

        "rows":
        rows
    }