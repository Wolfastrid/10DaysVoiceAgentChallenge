import json
import os
import time
from dataclasses import dataclass, field
from typing import Dict, Any, List


# -----------------------------
#   Grocery Cart State
# -----------------------------

@dataclass
class GroceryCartState:
    items: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    total: float = 0.0
    order_id: str | None = None
    timestamp: float | None = None

    def to_dict(self):
        return {
            "items": self.items,
            "total": self.total,
            "order_id": self.order_id,
            "timestamp": self.timestamp,
        }


# -----------------------------
#   Grocery Agent
# -----------------------------

class GroceryAgent:
    def __init__(self):
        # Catalog required by tests
        self.catalog = [
            {"name": "milk", "category": "dairy", "price": 30},
            {"name": "bread", "category": "bakery", "price": 25},
            {"name": "eggs", "category": "poultry", "price": 6},
            {"name": "rice", "category": "grains", "price": 60},
            {"name": "sugar", "category": "grocery", "price": 40},
            {"name": "pasta", "category": "grocery", "price": 50},
            {"name": "cheese", "category": "dairy", "price": 70},
            {"name": "tomato", "category": "vegetable", "price": 20},
            {"name": "potato", "category": "vegetable", "price": 30},
            {"name": "peanut butter", "category": "grocery", "price": 120},
        ]

        self.catalog_map = {i["name"]: i for i in self.catalog}

        self.cart = GroceryCartState()

        self.orders_file = "orders.json"
        self.tracking_file = "order_tracking.json"

        # Ensure files exist
        if not os.path.exists(self.orders_file):
            with open(self.orders_file, "w") as f:
                json.dump([], f)

        if not os.path.exists(self.tracking_file):
            with open(self.tracking_file, "w") as f:
                json.dump({}, f)

        # Mock-compatible property
        self._room = None

    # -----------------------------
    #   Utility
    # -----------------------------

    async def _send(self, ctx, text: str):
        """Used by tests (ctx is a MagicMock)."""
        if self._room:
            await self._room.send_text(text)
        return text

    # -----------------------------
    #   Cart Operations
    # -----------------------------

    async def add_item_to_cart(self, ctx, item, qty):
        if item not in self.catalog_map:
            return await self._send(ctx, f"{item} is not available.")

        price = self.catalog_map[item]["price"]

        if item not in self.cart.items:
            self.cart.items[item] = {"qty": qty, "price": price}
        else:
            self.cart.items[item]["qty"] += qty

        return await self._send(ctx, f"Added {qty} {item} to your cart.")

    async def update_item_quantity(self, ctx, item, qty):
        if item not in self.cart.items:
            return await self._send(ctx, f"{item} is not in your cart.")

        self.cart.items[item]["qty"] = qty
        return await self._send(ctx, f"Updated {item} quantity to {qty}.")

    async def remove_item_from_cart(self, ctx, item):
        if item in self.cart.items:
            del self.cart.items[item]
            return await self._send(ctx, f"Removed {item} from your cart.")

        return await self._send(ctx, f"{item} is not in your cart.")

    async def list_cart(self, ctx):
        if not self.cart.items:
            return await self._send(ctx, "Your cart is empty.")

        msg = "Your cart contains:\n"
        for name, data in self.cart.items.items():
            msg += f"- {name}: {data['qty']}\n"

        return await self._send(ctx, msg.strip())

    # -----------------------------
    #   Recipe Ingredients
    # -----------------------------

    async def add_ingredients_for_recipe(self, ctx, recipe):
        recipe = recipe.lower()

        recipes = {
            "peanut butter sandwich": ["bread", "peanut butter"],
            "pasta": ["pasta", "tomato"],
        }

        if recipe not in recipes:
            return await self._send(ctx, "Sorry, I don’t know that recipe.")

        added = []
        for item in recipes[recipe]:
            await self.add_item_to_cart(ctx, item, 1)
            added.append(item)

        return await self._send(ctx, f"Added ingredients for {recipe}: {', '.join(added)}.")

    # -----------------------------
    #   Order Operations
    # -----------------------------

    async def place_order(self, ctx, customer_name):
        if not self.cart.items:
            return await self._send(ctx, "Your cart is empty, cannot place order.")

        # Calculate total
        total = sum(d["qty"] * d["price"] for d in self.cart.items.values())
        self.cart.total = total

        order = {
            "orderId": str(int(time.time())),
            "customerName": customer_name,
            "items": self.cart.items,
            "total": total,
        }

        # Save to orders.json
        with open(self.orders_file) as f:
            orders = json.load(f)

        orders.append(order)

        with open(self.orders_file, "w") as f:
            json.dump(orders, f, indent=2)

        # Track order
        with open(self.tracking_file) as f:
            tracking = json.load(f)

        tracking[order["orderId"]] = "preparing"

        with open(self.tracking_file, "w") as f:
            json.dump(tracking, f, indent=2)

        # Save to cart state for tests
        self.cart.order_id = order["orderId"]
        self.cart.timestamp = time.time()

        return await self._send(ctx, f"Order placed successfully! Total: ₹{total}")

    # -----------------------------
    #   Tracking
    # -----------------------------

    def get_order_status(self, order_id):
        if not os.path.exists(self.tracking_file):
            return "unknown"

        with open(self.tracking_file) as f:
            tracking = json.load(f)

        return tracking.get(order_id, "unknown")

    # -----------------------------
    #   Previous Orders
    # -----------------------------

    async def list_previous_orders(self, ctx):
        with open(self.orders_file) as f:
            orders = json.load(f)

        if not orders:
            return await self._send(ctx, "No previous orders found.")

        return await self._send(ctx, f"Orders found: {len(orders)}")
