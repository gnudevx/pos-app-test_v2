from __future__ import annotations
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime

class CheckoutRequest(BaseModel):
    cart_id: int
    payment_info: str

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
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Dev agent: define Pydantic models for Order here.
# Use ConfigDict(from_attributes=True) — never class Config.
#
# CRITICAL — USE EXACT FIELD NAMES FROM CONTRACT BELOW (do NOT rename them):
#   POST /checkout → request_body: {cart_id: int, payment_info: str}
#   POST /checkout → response (201): {id: int, user_id: int, items: list, total_price: float, status: str, created_at: str}
#
# Example for auth:
#   class UserCreate(BaseModel):
#       email: EmailStr
#       password: str
#
#   class TokenResponse(BaseModel):
#       token: str          ← MUST be 'token', not 'access_token'
#       token_type: str = 'bearer'
