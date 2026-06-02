from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

router = APIRouter()

# Contract routes to implement:
#   GET /products → 200
#   GET /products/{id} → 200
#   POST /products → 201
#   PUT /products/{id} → 200
#   DELETE /products/{id} → 204
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import Response
from typing import List, Annotated

from app.models.product import ProductCreate, ProductUpdate, ProductResponse
from src.services.auth_backend.app.routes.auth import get_current_user_id

router = APIRouter()

# In-memory storage for products
_db: dict[int, dict] = {}
_next_id: int = 1

@router.get("/products", status_code=200, response_model=List[ProductResponse])
def list_products() -> List[ProductResponse]:
    """
    Retrieve a list of all products.
    """
    return [ProductResponse(**product_data) for product_data in _db.values()]

@router.get("/products/{id}", status_code=200, response_model=ProductResponse)
def get_product(id: int) -> ProductResponse:
    """
    Retrieve a single product by its ID.
    """
    product_data = _db.get(id)
    if not product_data:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductResponse(**product_data)

@router.post("/products", status_code=201, response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    current_user_id: Annotated[int, Depends(get_current_user_id)] # Auth required
) -> ProductResponse:
    """
    Create a new product. Requires authentication.
    """
    global _next_id
    try:
        product_data = product.model_dump()
        product_data["id"] = _next_id
        _db[_next_id] = product_data
        _next_id += 1
        return ProductResponse(**product_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {e}")

@router.put("/products/{id}", status_code=200, response_model=ProductResponse)
def update_product(
    id: int,
    product_update: ProductUpdate,
    current_user_id: Annotated[int, Depends(get_current_user_id)] # Auth required
) -> ProductResponse:
    """
    Update an existing product by its ID. Requires authentication.
    """
    product_data = _db.get(id)
    if not product_data:
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        update_data = product_update.model_dump(exclude_unset=True)
        product_data.update(update_data)
        _db[id] = product_data # Ensure the updated dict is stored back
        return ProductResponse(**product_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {e}")

@router.delete("/products/{id}", status_code=204)
def delete_product(
    id: int,
    current_user_id: Annotated[int, Depends(get_current_user_id)] # Auth required
) -> Response:
    """
    Delete a product by its ID. Requires authentication.
    """
    if id not in _db:
        raise HTTPException(status_code=404, detail="Product not found")
    del _db[id]
    return Response(status_code=204)

# Dev agent: implement each route above, replacing this comment block.
# Rules:
#   - Use EXACT paths, methods, status_codes from the contract above
#   - Return ALL response_fields listed in contract
#   - Handle ALL error cases
#   - NEVER return empty {} for 200/201 responses
