from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import Medicine, Location, Inventory
from app.routes.dashboard import router as dashboard_router
from app.routes.inventory import router as inventory_router
from app.routes.expiry import router as expiry_router
from app.routes.vendors import router as vendors_router
from app.routes.auth import router as auth_router

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Drug Inventory Management API",
    description="Backend API for Drug Inventory Management System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(dashboard_router)
app.include_router(inventory_router)
app.include_router(expiry_router)
app.include_router(vendors_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "Drug Inventory Management API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }