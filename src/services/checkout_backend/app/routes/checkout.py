from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

router = APIRouter()

# Contract routes to implement:
#   POST /checkout → 201
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import Response
from typing import List, Annotated
from datetime import datetime, timezone

# Auth dependency
from src.services.auth_backend.app.routes.auth import get_current_user_id

# Models for request/response
from app.models.order import CheckoutRequest, OrderItem, OrderResponse

# Shared state from other services
from src.services.shopping_cart_backend.app.routes.cart import _carts_db
from src.services.product_catalog_backend.app.routes.products import _db as products_db
from src.services.inventory_backend.app.routes.inventory import _inventory_db, _record_audit_log
from src.services.order_history_backend.app.routes.orders import _orders_db, _next_order_id_container

router = APIRouter()

@router.post("/checkout", status_code=201, response_model=OrderResponse)
def process_checkout(
    checkout_request: CheckoutRequest,
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> OrderResponse:
    """
    Processes the cart into an order, deducts inventory, and generates a receipt.
    Requires authentication.
    """
    # 1. Validate cart and payment info
    user_cart = _carts_db.get(current_user_id)

    if not user_cart or user_cart["id"] != checkout_request.cart_id:
        raise HTTPException(status_code=400, detail="Invalid cart ID or cart not found for user")

    if not user_cart["items"]:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Payment info validation (placeholder, as it's a string in contract)
    if not checkout_request.payment_info:
        raise HTTPException(status_code=400, detail="Payment information is required")

    # Prepare for atomic transaction: first validate all, then commit all
    items_to_order: List[OrderItem] = []
    total_price: float = 0.0
    stock_deductions: List[dict] = [] # To store {product_id, quantity, old_stock, new_stock}

    for cart_item in user_cart["items"]:
        product_id = cart_item["product_id"]
        quantity = cart_item["quantity"]

        product_data = products_db.get(product_id)
        if not product_data:
            raise HTTPException(status_code=400, detail=f"Product with ID {product_id} not found")

        price_at_purchase = product_data["price"]
        current_stock = _inventory_db.get(product_id, 0)

        if current_stock < quantity:
            raise HTTPException(status_code=409, detail=f"Insufficient stock for product ID {product_id}. Available: {current_stock}, Requested: {quantity}")

        items_to_order.append(
            OrderItem(
                product_id=product_id,
                quantity=quantity,
                price_at_purchase=price_at_purchase
            )
        )
        total_price += price_at_purchase * quantity
        stock_deductions.append({
            "product_id": product_id,
            "quantity": quantity,
            "old_stock": current_stock,
            "new_stock": current_stock - quantity
        })

    # All validations passed, proceed with writes (simulated atomic transaction)

    # 2. Deduct inventory
    for deduction in stock_deductions:
        product_id = deduction["product_id"]
        quantity = deduction["quantity"]
        old_stock = deduction["old_stock"]
        new_stock = deduction["new_stock"]

        _inventory_db[product_id] = new_stock
        _record_audit_log(current_user_id, product_id, -quantity, old_stock, new_stock)

    # 3. Generate and store order
    order_id = _next_order_id_container[0]
    _next_order_id_container[0] += 1

    new_order_data = {
        "id": order_id,
        "user_id": current_user_id,
        "items": [item.model_dump() for item in items_to_order],
        "total_price": round(total_price, 2),
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    _orders_db[order_id] = new_order_data

    # 4. Clear the user's cart
    del _carts_db[current_user_id]

    return OrderResponse(**new_order_data)

# Dev agent: implement each route above, replacing this comment block.
# Rules:
#   - Use EXACT paths, methods, status_codes from the contract above
#   - Return ALL response_fields listed in contract
#   - Handle ALL error cases
#   - NEVER return empty {} for 200/201 responses
