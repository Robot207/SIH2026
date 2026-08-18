from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(request: LoginRequest):
    # Mock authentication logic moved from frontend
    if request.username == "admin" and request.password == "admin":
        return {"role": "system_admin", "token": "mock-token-admin"}
    elif request.username == "hospital" and request.password == "hospital":
        return {"role": "admin_hospital", "token": "mock-token-hospital"}
    elif request.username == "vendor" and request.password == "vendor":
        return {"role": "vendor_pharma", "token": "mock-token-vendor"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")
