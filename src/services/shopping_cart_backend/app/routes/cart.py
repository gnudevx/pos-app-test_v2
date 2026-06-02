from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

router = APIRouter()

# Contract routes to implement:
#   POST /cart/add → 200
#   PUT /cart/update/{item_id} → 200
#   DELETE /cart/remove/{item_id} → 204
#   GET /cart → 200
#   DELETE /cart/clear → 204
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import Response
from typing import List, Annotated

from app.models.cart import CartItemCreate, CartItemUpdate, CartResponse, CartItemResponse
from src.services.auth_backend.app.routes.auth import get_current_user_id
from src.services.product_catalog_backend.app.routes.products import _db as products_db

router = APIRouter()

# In-memory storage for carts: {user_id: {id: user_id, user_id: user_id, items: [{item_id, product_id, quantity}]}}
_carts_db: dict[int, dict] = {}
_next_item_id: int = 1 # Global counter for unique item IDs across all carts

def _get_user_cart(user_id: int) -> dict:
    """Retrieves or initializes a cart for a given user."""
    if user_id not in _carts_db:
        _carts_db[user_id] = {"id": user_id, "user_id": user_id, "items": []}
    return _carts_db[user_id]

@router.post("/cart/add", status_code=200, response_model=CartResponse)
def add_item_to_cart(
    item_create: CartItemCreate,
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> CartResponse:
    """
    Adds a product to the user's shopping cart or updates its quantity if already present.
    """
    global _next_item_id

    if item_create.quantity <= 0:
        raise HTTPException(status_code=400, detail="Invalid quantity. Must be positive.")

    if item_create.product_id not in products_db:
        raise HTTPException(status_code=404, detail="Product not found")

    user_cart = _get_user_cart(current_user_id)
    
    # Check if product already exists in cart
    existing_item = None
    for item in user_cart["items"]:
        if item["product_id"] == item_create.product_id:
            existing_item = item
            break

    if existing_item:
        existing_item["quantity"] += item_create.quantity
    else:
        new_item = {
            "item_id": _next_item_id,
            "product_id": item_create.product_id,
            "quantity": item_create.quantity
        }
        user_cart["items"].append(new_item)
        _next_item_id += 1
    
    return CartResponse(**user_cart)

@router.put("/cart/update/{item_id}", status_code=200, response_model=CartResponse)
def update_cart_item(
    item_id: int,
    item_update: CartItemUpdate,
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> CartResponse:
    """
    Updates the quantity of a specific item in the user's cart.
    """
    if item_update.quantity < 0:
        raise HTTPException(status_code=400, detail="Invalid quantity. Must be non-negative.")

    user_cart = _get_user_cart(current_user_id)
    
    found_item = None
    for item in user_cart["items"]:
        if item["item_id"] == item_id:
            found_item = item
            break

    if not found_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    if item_update.quantity == 0:
        user_cart["items"].remove(found_item)
    else:
        found_item["quantity"] = item_update.quantity
    
    return CartResponse(**user_cart)

@router.delete("/cart/remove/{item_id}", status_code=204)
def remove_cart_item(
    item_id: int,
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> Response:
    """
    Removes a specific item from the user's cart.
    """
    user_cart = _get_user_cart(current_user_id)
    
    initial_item_count = len(user_cart["items"])
    user_cart["items"] = [item for item in user_cart["items"] if item["item_id"] != item_id]

    if len(user_cart["items"]) == initial_item_count:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    return Response(status_code=204)

@router.get("/cart", status_code=200, response_model=CartResponse)
def get_user_cart(
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> CartResponse:
    """
    Retrieves the current shopping cart for the authenticated user.
    """
    user_cart = _get_user_cart(current_user_id)
    return CartResponse(**user_cart)

@router.delete("/cart/clear", status_code=204)
def clear_user_cart(
    current_user_id: Annotated[int, Depends(get_current_user_id)]
) -> Response:
    """
    Clears all items from the user's shopping cart.
    """
    if current_user_id in _carts_db:
        del _carts_db[current_user_id]
    
    return Response(status_code=204)

# Dev agent: implement each route above, replacing this comment block.
# Rules:
#   - Use EXACT paths, methods, status_codes from the contract above
#   - Return ALL response_fields listed in contract
#   - Handle ALL error cases
#   - NEVER return empty {} for 200/201 responses
