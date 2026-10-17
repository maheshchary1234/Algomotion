import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as arena_router

app = FastAPI(
    title="AlgoMotion Execution Engine & Coding Arena API",
    description="Real sandboxed code execution for Python 3 and Java with competitive programming problem evaluation.",
    version="2.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(arena_router)

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
