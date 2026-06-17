from fastapi import FastAPI
from app.api.routes import router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os



app = FastAPI(
    title="RMD Calculator API",
)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "https://lackner-rmd-vercel.app",

        "http://localhost:3000"

    ],

    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"],

)
 

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

MEDIA_DIR = os.path.join(
    BASE_DIR,
    "media"
)


app.include_router(router)

app.mount(
    "/media",
    StaticFiles(directory=MEDIA_DIR),
    name="media"
)

@app.get("/")
def health_check():
    return {"status": "checking if API is up and running"}