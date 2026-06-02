from __future__ import annotations
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None

class ProductResponse(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Dev agent: define Pydantic models for Product here.
# Use ConfigDict(from_attributes=True) — never class Config.
#
# CRITICAL — USE EXACT FIELD NAMES FROM CONTRACT BELOW (do NOT rename them):
#   GET /products → response (200): {items: list}
#   GET /products/{id} → response (200): {id: int, name: str, description: str, price: float, stock: int}
#   POST /products → request_body: {name: str, description: str, price: float, stock: int}
#   POST /products → response (201): {id: int, name: str, description: str, price: float, stock: int}
#   PUT /products/{id} → request_body: {name: str, description: str, price: float, stock: int}
#   PUT /products/{id} → response (200): {id: int, name: str, description: str, price: float, stock: int}
#
# Example for auth:
#   class UserCreate(BaseModel):
#       email: EmailStr
#       password: str
#
#   class TokenResponse(BaseModel):
#       token: str          ← MUST be 'token', not 'access_token'
#       token_type: str = 'bearer'
