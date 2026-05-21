from fastapi import APIRouter

from app.models.request_models import RmdRequest
from app.services.rmd_engine import calculate_schedule

from app.services.charts import generate_chart_data
from app.services.manim_service import render_scene

router = APIRouter()


@router.post("/calculate")
def calculate_rmd(request: RmdRequest):

    result = calculate_schedule(request.dict())

    return result


@router.post("/charts/{scenario}")
def calculate_rmd_chart(
    scenario: str,
    request: RmdRequest
):

    data = request.dict()

    data["scenario"] = scenario

    result = calculate_schedule(data)

    chart_data = generate_chart_data(
        result["rows"]
    )

    return {

        "scenario": scenario,

        "schedule": result,

        "charts": chart_data
    }


# =========================================
# CINEMATIC MANIM API
# =========================================

@router.post(
    "/cinematic/{financial_scenario}/{scene_type}"
)
def generate_cinematic(

    financial_scenario: str,

    scene_type: str,

    request: RmdRequest
):

    # -------------------------------------
    # PREPARE ENGINE INPUT
    # -------------------------------------

    data = request.dict()

    data["scenario"] = (
        financial_scenario
    )

    # -------------------------------------
    # CALCULATE RMD ENGINE
    # -------------------------------------

    result = calculate_schedule(
        data
    )

    # -------------------------------------
    # GENERATE CHART DATA
    # -------------------------------------

    chart_data = generate_chart_data(
        result["rows"]
    )

    # -------------------------------------
    # RENDER CINEMATIC SCENE
    # -------------------------------------

    video_url = render_scene(
        scene_type,
        chart_data
    )

    # -------------------------------------
    # RESPONSE
    # -------------------------------------

    return {

        "financial_scenario":
        financial_scenario,

        "scene_type":
        scene_type,

        "video_url":
        video_url,

        "summary": {

            "endingBalance":
            result["endingBalance"],

            "totalRmd":
            result["totalRmd"],

            "totalTax":
            result["totalTax"],

            "totalGrowth":
            result["totalGrowth"]
        }
    }