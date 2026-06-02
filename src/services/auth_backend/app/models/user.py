from __future__ import annotations
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class UserInDB(BaseModel):
    id: int
    email: EmailStr
    hashed_password: str

    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    token: str

    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    user_id: int

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    token: str

    model_config = ConfigDict(from_attributes=True)

# Dev agent: define Pydantic models for User here.
# Use ConfigDict(from_attributes=True) — never class Config.
#
# CRITICAL — USE EXACT FIELD NAMES FROM CONTRACT BELOW (do NOT rename them):
#   POST /auth/signup → request_body: {email: str, password: str}
#   POST /auth/signup → response (201): {id: int, email: str, token: str}
#   POST /auth/login → request_body: {email: str, password: str}
#   POST /auth/login → response (200): {token: str, user_id: int}
#   POST /auth/refresh → response (200): {token: str}
#
# Example for auth:
#   class UserCreate(BaseModel):
#       email: EmailStr
#       password: str
#
#   class TokenResponse(BaseModel):
#       token: str          ← MUST be 'token', not 'access_token'
#       token_type: str = 'bearer'
