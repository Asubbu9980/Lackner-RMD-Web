from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.models.request_models import RmdRequest
from app.services.rmd_engine import calculate_schedule

from app.services.charts import generate_chart_data
from app.services.manim_service import start_render_job, get_job

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
    # SUMMARY
    # -------------------------------------

    summary = {

        "endingBalance":
        result["endingBalance"],

        "totalRmd":
        result["totalRmd"],

        "totalTax":
        result["totalTax"],

        "totalGrowth":
        result["totalGrowth"]
    }

    # -------------------------------------
    # START CINEMATIC RENDER (async)
    # -------------------------------------
    # Rendering happens on a background thread so the client can poll
    # /cinematic/status/{job_id} for real render progress instead of
    # blocking on a single long request.

    job_id = start_render_job(
        scene_type,
        chart_data,
        summary,
    )

    # -------------------------------------
    # RESPONSE
    # -------------------------------------

    return {

        "financial_scenario":
        financial_scenario,

        "scene_type":
        scene_type,

        "job_id":
        job_id,

        "summary":
        summary
    }


# =========================================
# RENDER PROGRESS STATUS
# =========================================

@router.get("/cinematic/status/{job_id}")
def cinematic_status(job_id: str):

    job = get_job(job_id)

    if job is None:

        return JSONResponse(
            status_code=404,
            content={"error": "Job not found"},
        )

    return {

        "status": job["status"],

        "progress": job["progress"],

        "stage": job["stage"],

        "video_url": job["video_url"],

        "summary": job["summary"],

        "error": job["error"],
    }