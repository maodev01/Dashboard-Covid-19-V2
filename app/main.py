from fastapi import FastAPI, Request, Query
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Optional
from .services import fetch_covid_data, process_summary, process_timeline, process_demographics, process_locations, filter_data
import time

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Simple in-memory cache
_cache = {
    "data": [],
    "timestamp": 0
}
CACHE_DURATION = 300  # 5 minutes

def get_data():
    now = time.time()
    if not _cache["data"] or now - _cache["timestamp"] > CACHE_DURATION:
        print("Fetching fresh data...")
        _cache["data"] = fetch_covid_data()
        _cache["timestamp"] = now
    return _cache["data"]

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/summary")
def get_summary(department: Optional[str] = None, city: Optional[str] = None, gender: Optional[str] = None):
    data = get_data()
    filtered = filter_data(data, department, city, gender)
    return process_summary(filtered)

@app.get("/api/timeline")
def get_timeline(department: Optional[str] = None, city: Optional[str] = None, gender: Optional[str] = None):
    data = get_data()
    filtered = filter_data(data, department, city, gender)
    return process_timeline(filtered)

@app.get("/api/demographics")
def get_demographics(department: Optional[str] = None, city: Optional[str] = None, gender: Optional[str] = None):
    data = get_data()
    filtered = filter_data(data, department, city, gender)
    return process_demographics(filtered)

@app.get("/api/locations")
def get_locations():
    data = get_data()
    return process_locations(data)

