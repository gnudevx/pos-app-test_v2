from __future__ import annotations
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field
from typing import List
from datetime import datetime

class OrderItem(BaseModel):
    product_id: int
    quantity: int
    price_at_purchase: float

class OrderResponse(BaseModel):
    id: int
    user_id: int
    items: List[OrderItem]
    total_price: float
    status: str
    created_at: str # ISO 8601 string

    model_config = ConfigDict(from_attributes=True)

class OrderListResponse(BaseModel):
    items: List[OrderResponse]

    model_config = ConfigDict(from_attributes=True)

# Dev agent: define Pydantic models for Order here.
# Use ConfigDict(from_attributes=True) — never class Config.
#
# CRITICAL — USE EXACT FIELD NAMES FROM CONTRACT BELOW (do NOT rename them):
#   GET /orders → response (200): {items: list}
#   GET /orders/{id} → response (200): {id: int, user_id: int, items: list, total_price: float, status: str, created_at: str}
#
# Example for auth:
#   class UserCreate(BaseModel):
#       email: EmailStr
#       password: str
#
#   class TokenResponse(BaseModel):
#       token: str          ← MUST be 'token', not 'access_token'
#       token_type: str = 'bearer'
