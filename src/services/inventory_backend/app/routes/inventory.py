from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

router = APIRouter()

# Contract routes to implement:
#   GET /inventory → 200
#   PUT /inventory/{product_id}/adjust → 200
#   PUT /inventory/{product_id}/deduct → 200
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import Response
from typing import List, Annotated
from datetime import datetime, timezone

from app.models.inventory import (
    InventoryItem,
    InventoryListResponse,
    InventoryAdjustRequest,
    InventoryDeductRequest,
    InventoryUpdateResponse,
    AuditLogEntry
)
from src.services.auth_backend.app.routes.auth import get_current_user_id
from src.services.product_catalog_backend.app.routes.products import _db as products_db

router = APIRouter()

# In-memory storage for inventory: {product_id: stock_level}
_inventory_db: dict[int, int] = {}
# In-memory storage for audit logs
_audit_log: list[dict] = []

def _record_audit_log(user_id: int, product_id: int, change: int, old_stock: int, new_stock: int):
    """Records an entry in the audit log."""
    log_entry = AuditLogEntry(
        timestamp=datetime.now(timezone.utc),
        user_id=user_id,
        product_id=product_id,
        change=change,
        old_stock=old_stock,
        new_stock=new_stock
    )
    _audit_log.append(log_entry.model_dump())

@router.get("/inventory", status_code=200, response_model=InventoryListResponse)
def list_inventory(
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> InventoryListResponse:
    """
    Retrieve a list of all inventory items with their stock levels.
    Requires authentication.
    """
    items = []
    for product_id, stock in _inventory_db.items():
        items.append(InventoryItem(product_id=product_id, stock=stock))
    return InventoryListResponse(items=items)

@router.put("/inventory/{product_id}/adjust", status_code=200, response_model=InventoryUpdateResponse)
def adjust_inventory(
    product_id: int,
    request: InventoryAdjustRequest,
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> InventoryUpdateResponse:
    """
    Adjust the stock level for a specific product.
    Requires authentication.
    """
    if product_id not in products_db:
        raise HTTPException(status_code=404, detail="Product not found")

    if request.change == 0:
        raise HTTPException(status_code=400, detail="Invalid change amount: must be non-zero.")

    old_stock = _inventory_db.get(product_id, 0)
    new_stock = old_stock + request.change
    
    # Stock cannot go below zero, even with adjustments.
    # If a negative adjustment would make stock negative, cap it at 0.
    # This is a business rule interpretation for "manual adjustment".
    if new_stock < 0:
        new_stock = 0 

    _inventory_db[product_id] = new_stock
    _record_audit_log(current_user_id, product_id, request.change, old_stock, new_stock)

    return InventoryUpdateResponse(product_id=product_id, new_stock=new_stock)

@router.put("/inventory/{product_id}/deduct", status_code=200, response_model=InventoryUpdateResponse)
def deduct_inventory(
    product_id: int,
    request: InventoryDeductRequest,
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> InventoryUpdateResponse:
    """
    Deduct a specified quantity from a product's stock.
    Requires authentication.
    """
    if product_id not in products_db:
        raise HTTPException(status_code=404, detail="Product not found")

    if request.quantity <= 0:
        raise HTTPException(status_code=400, detail="Invalid quantity: must be positive.")

    old_stock = _inventory_db.get(product_id, 0)

    if old_stock < request.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    new_stock = old_stock - request.quantity
    _inventory_db[product_id] = new_stock
    _record_audit_log(current_user_id, product_id, -request.quantity, old_stock, new_stock)

    return InventoryUpdateResponse(product_id=product_id, new_stock=new_stock)

# Dev agent: implement each route above, replacing this comment block.
# Rules:
#   - Use EXACT paths, methods, status_codes from the contract above
#   - Return ALL response_fields listed in contract
#   - Handle ALL error cases
#   - NEVER return empty {} for 200/201 responses
