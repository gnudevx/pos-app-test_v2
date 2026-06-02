from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

router = APIRouter()

# Contract routes to implement:
#   GET /orders → 200
#   GET /orders/{id} → 200
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import Response
from typing import List, Annotated
from datetime import datetime, timezone

from app.models.order import OrderItem, OrderResponse, OrderListResponse
from src.services.auth_backend.app.routes.auth import get_current_user_id

router = APIRouter()

# In-memory storage for orders: {order_id: order_data_dict}
# This database is assumed to be populated by a checkout service (not part of this task).
# For demonstration, we'll pre-populate with some dummy data.
_orders_db: dict[int, dict] = {}
_next_order_id: int = 1

# Pre-populate with dummy data for testing
def _initialize_dummy_orders():
    global _next_order_id
    if not _orders_db:
        # Order for user_id 1 (default for get_current_user_id fallback)
        order1_items = [
            OrderItem(product_id=101, quantity=2, price_at_purchase=15.99).model_dump(),
            OrderItem(product_id=102, quantity=1, price_at_purchase=5.00).model_dump(),
        ]
        order1_total = sum(item["quantity"] * item["price_at_purchase"] for item in order1_items)
        _orders_db[_next_order_id] = {
            "id": _next_order_id,
            "user_id": 1,
            "items": order1_items,
            "total_price": round(order1_total, 2),
            "status": "completed",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        _next_order_id += 1

        # Another order for user_id 1
        order2_items = [
            OrderItem(product_id=103, quantity=1, price_at_purchase=29.99).model_dump(),
        ]
        order2_total = sum(item["quantity"] * item["price_at_purchase"] for item in order2_items)
        _orders_db[_next_order_id] = {
            "id": _next_order_id,
            "user_id": 1,
            "items": order2_items,
            "total_price": round(order2_total, 2),
            "status": "completed",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        _next_order_id += 1

        # Order for a different user (e.g., user_id 2)
        order3_items = [
            OrderItem(product_id=104, quantity=3, price_at_purchase=7.50).model_dump(),
        ]
        order3_total = sum(item["quantity"] * item["price_at_purchase"] for item in order3_items)
        _orders_db[_next_order_id] = {
            "id": _next_order_id,
            "user_id": 2,
            "items": order3_items,
            "total_price": round(order3_total, 2),
            "status": "completed",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        _next_order_id += 1

_initialize_dummy_orders()


@router.get("/orders", status_code=200, response_model=OrderListResponse)
def list_orders(
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> OrderListResponse:
    """
    Retrieve a list of all past sales orders for the authenticated user.
    """
    user_orders = [
        OrderResponse(**order_data)
        for order_data in _orders_db.values()
        if order_data["user_id"] == current_user_id
    ]
    return OrderListResponse(items=user_orders)

@router.get("/orders/{id}", status_code=200, response_model=OrderResponse)
def get_order_details(
    id: int,
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> OrderResponse:
    """
    Retrieve the detailed receipt for a specific past order.
    """
    order_data = _orders_db.get(id)

    if not order_data or order_data["user_id"] != current_user_id:
        raise HTTPException(status_code=404, detail="Order not found")

    return OrderResponse(**order_data)

# Dev agent: implement each route above, replacing this comment block.
# Rules:
#   - Use EXACT paths, methods, status_codes from the contract above
#   - Return ALL response_fields listed in contract
#   - Handle ALL error cases
#   - NEVER return empty {} for 200/201 responses
