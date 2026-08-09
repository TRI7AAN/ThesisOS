from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.db import get_driver, close_driver


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: driver is initialized on first use via get_driver()
    yield
    # Shutdown
    close_driver()


app = FastAPI(title="ThesisOS", lifespan=lifespan)


@app.get("/health")
async def health_check():
    from app.db import check_neo4j_connectivity
    is_connected = await check_neo4j_connectivity()
    if is_connected:
        return {"status": "ok", "neo4j": "connected"}
    return {"status": "degraded", "neo4j": "unreachable"}, 503