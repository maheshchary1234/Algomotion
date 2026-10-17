import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as arena_router
from app.api.auth_routes import router as auth_router, user_router
from app.database import init_db

app = FastAPI(
    title="AlgoMotion Execution Engine, Auth & Coding Arena API",
    description="Real sandboxed code execution, student authentication, and progress tracking.",
    version="2.0.0"
)

@app.on_event("startup")
def on_startup():
    init_db()

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(arena_router)
app.include_router(auth_router)
app.include_router(user_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AlgoMotion Sandboxed Execution Engine",
        "supported_languages": ["python", "java"],
        "python_version": "3.11+",
        "java_version": "OpenJDK 25+"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
