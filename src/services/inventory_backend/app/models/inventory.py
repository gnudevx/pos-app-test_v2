from __future__ import annotations
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime

class InventoryItem(BaseModel):
    product_id: int
    stock: int
    model_config = ConfigDict(from_attributes=True)

class InventoryListResponse(BaseModel):
    items: List[InventoryItem]
    model_config = ConfigDict(from_attributes=True)

class InventoryAdjustRequest(BaseModel):
    change: int
    model_config = ConfigDict(from_attributes=True)

class InventoryDeductRequest(BaseModel):
    quantity: int
    model_config = ConfigDict(from_attributes=True)

class InventoryUpdateResponse(BaseModel):
    product_id: int
    new_stock: int
    model_config = ConfigDict(from_attributes=True)

class AuditLogEntry(BaseModel):
    timestamp: datetime
    user_id: int
    product_id: int
    change: int
    old_stock: int
    new_stock: int
    model_config = ConfigDict(from_attributes=True)

# Dev agent: define Pydantic models for Inventory here.
# Use ConfigDict(from_attributes=True) — never class Config.
#
# CRITICAL — USE EXACT FIELD NAMES FROM CONTRACT BELOW (do NOT rename them):
#   GET /inventory → response (200): {items: list}
#   PUT /inventory/{product_id}/adjust → request_body: {change: int}
#   PUT /inventory/{product_id}/adjust → response (200): {product_id: int, new_stock: int}
#   PUT /inventory/{product_id}/deduct → request_body: {quantity: int}
#   PUT /inventory/{product_id}/deduct → response (200): {product_id: int, new_stock: int}
#
# Example for auth:
#   class UserCreate(BaseModel):
#       email: EmailStr
#       password: str
#
#   class TokenResponse(BaseModel):
#       token: str          ← MUST be 'token', not 'access_token'
#       token_type: str = 'bearer'
