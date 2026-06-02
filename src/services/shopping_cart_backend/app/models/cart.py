from __future__ import annotations
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from typing import List

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    item_id: int
    product_id: int
    quantity: int
    model_config = ConfigDict(from_attributes=True)

class CartResponse(BaseModel):
    id: int # This will be the user_id
    user_id: int
    items: List[CartItemResponse]
    model_config = ConfigDict(from_attributes=True)

# Dev agent: define Pydantic models for Cart here.
# Use ConfigDict(from_attributes=True) — never class Config.
#
# CRITICAL — USE EXACT FIELD NAMES FROM CONTRACT BELOW (do NOT rename them):
#   POST /cart/add → request_body: {product_id: int, quantity: int}
#   POST /cart/add → response (200): {id: int, user_id: int, items: list}
#   PUT /cart/update/{item_id} → request_body: {quantity: int}
#   PUT /cart/update/{item_id} → response (200): {id: int, user_id: int, items: list}
#   GET /cart → response (200): {id: int, user_id: int, items: list}
#
# Example for auth:
#   class UserCreate(BaseModel):
#       email: EmailStr
#       password: str
#
#   class TokenResponse(BaseModel):
#       token: str          ← MUST be 'token', not 'access_token'
#       token_type: str = 'bearer'
