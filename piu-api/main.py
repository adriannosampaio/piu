from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Piu API!"}


trends_data = [
    "#slowweekends",
    "#35mmfilm",
    "#citynotes",
    "#madebyhand",
    "#urbanexploration",
    "#streetphotography",
    "#vintagevibes",
    "#election2024",
    "#longweek",

]

class Trend(BaseModel):
    tag: str
    posts: int

@app.get("/trends", response_model=list[Trend])
async def get_trends():
    tags = set()
    while len(tags) < 4:
        tags.add(random.choice(trends_data))
    # Placeholder for logic to fetch and return trends data
    return [
            Trend(tag=tag, posts=random.randint(1000, 10000)) for tag in tags
    ]
