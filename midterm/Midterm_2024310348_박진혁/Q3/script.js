/* ===========================
   QUESTION 3 — SKELETON CODE
   Restaurant Menu Ordering (Code Completion)
   ===========================

   RULES:
   - You may ONLY edit the three TODO methods:
       (1) Order.prototype.addItem(itemName, qty)
       (2) Order.prototype.removeItem(itemName, qty)
       (3) Restaurant.prototype.checkout(order)
   - Do NOT add new properties, methods, or change constructors.
   - Do NOT modify the test/assertion section except to comment it out locally.
   - Use the exact error messages specified below.

   OBJECTS:
   - MenuItem: name (unique), price >= 0 (KRW), stock >= 0 (shared), salesLog[] (shared)
   - Order: id, restaurant, lines[] = [{ item: MenuItem, qty: number }], status: "open" | "paid"
   - Restaurant: name, menu (array of MenuItem)

   SHARED STATE:
   - The same MenuItem instance may appear in multiple Restaurant menus.
     Its stock and salesLog must be shared between restaurants.

   REQUIRED ERROR MESSAGES:
   - throw new Error("Invalid quantity")
   - throw new Error("Out of stock")
   - throw new Error("Order not open")

   BEHAVIOR MODEL:
   - addItem: reserves stock immediately (decrement stock), and upserts a cart line.
   - removeItem: releases reserved stock (increment stock), decrement or remove the line.
   - checkout: totals the order, appends per-item sales logs, marks order paid.
*/

"use strict";

/* ===== DO NOT MODIFY: Data Models ===== */
class MenuItem {
    constructor(name, price, stock) {
        this.name = name; // unique
        this.price = price; // KRW integer
        this.stock = stock; // integer >= 0 (shared if same instance)
        this.salesLog = []; // shared across restaurants
    }
}

class Order {
    constructor(id, restaurant) {
        this.id = id;
        this.restaurant = restaurant;
        this.lines = []; // [{ item: MenuItem, qty: number }]
        this.status = "open"; // "open" | "paid"
    }

    /* ===== TODO (1): addItem(itemName, qty)
     REQUIREMENTS:
     - Validate qty: must be a positive integer, else throw "Invalid quantity".
     - Find MenuItem by name in this.restaurant.menu. If not found, do nothing (silent).
     - If item.stock < qty, throw "Out of stock".
     - Reserve stock immediately: item.stock -= qty.
     - If item already in this.lines, increase its qty; else push a new line { item, qty }.
  */
    addItem(itemName, qty) {
        // YOUR CODE HERE
        if (!Number.isInteger(qty) || qty <= 0) {
            throw new Error("Invalid quantity");
        }
        let item = this.restaurant.menu.find((i) => i.name === itemName);
        if (!item) return;
        if (item.stock < qty) {
            throw new Error("Out of stock");
        }
        item.stock -= qty;
        let line = this.lines.find((l) => l.item.name === itemName);
        if (line) {
            line.qty += qty;
        } else {
            this.lines.push({ item: item, qty: qty });
        }
    }

    /* ===== TODO (2): removeItem(itemName, qty)
     REQUIREMENTS:
     - Validate qty: must be a positive integer, else throw "Invalid quantity".
     - If the line does not exist, do nothing (silent).
     - Release stock: line.item.stock += qty.
     - Decrease line.qty by qty; if line.qty <= 0, remove the line entirely.
  */
    removeItem(itemName, qty) {
        // YOUR CODE HERE
        if (!Number.isInteger(qty) || qty <= 0) {
            throw new Error("Invalid quantity");
        }
        if (this.lines.length === 0) return;
        let lineIndex = this.lines.findIndex((l) => l.item.name === itemName);
        if (lineIndex === -1) return;
        let line = this.lines[lineIndex];
        line.item.stock += qty;
        line.qty -= qty;
        if (line.qty <= 0) {
            this.lines.splice(lineIndex, 1);
        }
    }
}

class Restaurant {
    constructor(name, menuItems) {
        this.name = name;
        this.menu = menuItems; // array of MenuItem (may be shared instances)
    }

    /* ===== TODO (3): checkout(order)
     REQUIREMENTS:
     - Only proceed if order.status === "open" and order has at least one line; otherwise throw "Order not open".
     - Compute total using current item.price * qty (KRW ints).
     - Append to each involved item.salesLog an entry: { orderId, qty, amount }
       where amount = price * qty at checkout time.
     - Set order.status = "paid".
     - Return the numeric total (KRW integer).
  */
    checkout(order) {
        // YOUR CODE HERE
        if (order.status !== "open" || order.lines.length === 0) {
            throw new Error("Order not open");
        }
        let total = 0;
        for (let line of order.lines) {
            let amount = line.itemprice * line.qty;
            line.item.salesLog.push({
                orderId: order.id,
                qty: line.qty,
                amount: amount,
            });
            total += amount;
        }
        order.status = "paid";
        return total;
    }

    createOrder(orderId) {
        return new Order(orderId, this);
    }
}

/* ===== DO NOT MODIFY: Helpers & KRW Formatter ===== */
function assert(cond, msg) {
    if (!cond) throw new Error(msg);
}
function newOrderId() {
    return Math.random().toString(36).slice(2, 7).toUpperCase();
}
function won(n) {
    return `₩${Math.round(n).toLocaleString("ko-KR")}`;
}

/* ===== DO NOT MODIFY: Menu Items (KRW prices & starting stock) ===== */
/* Shared drinks (appear in both restaurants) */
const mineralWater = new MenuItem("Mineral Water", 1000, 20);
const coke = new MenuItem("Coke", 2000, 15);
const juice = new MenuItem("Juice", 3500, 10);

/* Korean restaurant exclusive menu */
const kimbap = new MenuItem("Kimbap", 4000, 8);
const kimchiStew = new MenuItem("Kimchi Stew", 7000, 6);
const softTofuStew = new MenuItem("Soft Tofu Stew", 7000, 6);

/* Fast food exclusive menu */
const burger = new MenuItem("Burger", 8000, 10);
const fries = new MenuItem("Fries", 3000, 20);
const friedChicken = new MenuItem("Fried Chicken", 8500, 8);

/* ===== DO NOT MODIFY: Restaurants (share drink instances) ===== */
const koreanRestaurant = new Restaurant("Korean Restaurant", [
    kimbap,
    kimchiStew,
    softTofuStew,
    mineralWater,
    coke,
    juice,
]);
const fastFoodRestaurant = new Restaurant("Fast Food Restaurant", [
    burger,
    fries,
    friedChicken,
    mineralWater,
    coke,
    juice,
]);

/* ===== SELF-TESTS (for your own validation; not used in grading) =====
   You can run in the browser console or Node. */
(function runTests() {
    // 1) addItem reserves stock & upserts lines (Korean Restaurant)
    const o1 = koreanRestaurant.createOrder("KR1");
    o1.addItem("Kimbap", 2); // Kimbap stock: 8 -> 6
    o1.addItem("Mineral Water", 1); // Mineral Water stock: 20 -> 19
    o1.addItem("Kimbap", 1); // Kimbap line qty becomes 3; stock: 6 -> 5
    assert(kimbap.stock === 5, "T1: Kimbap stock reservation failed");
    assert(
        o1.lines.find((l) => l.item.name === "Kimbap")?.qty === 3,
        "T1: upsert failed"
    );

    // 2) removeItem releases reservation
    o1.removeItem("Kimbap", 2); // Kimbap stock: 5 -> 7; line qty now 1
    assert(kimbap.stock === 7, "T2: Kimbap stock release failed");

    // 3) removing to zero deletes the line
    o1.removeItem("Mineral Water", 1); // MW stock: 19 -> 20; line removed
    assert(
        !o1.lines.some((l) => l.item.name === "Mineral Water"),
        "T3: MW line not removed"
    );
    assert(mineralWater.stock === 20, "T3: MW stock not restored");

    // 4) add beyond stock should throw
    let threw = false;
    try {
        o1.addItem("Coke", 999);
    } catch (e) {
        threw = e.message === "Out of stock";
    }
    assert(threw, "T4: expected Out of stock");

    // 5) checkout computes total and logs per item (KRW)
    //    Current o1 lines: Kimbap qty=1 (after removals above)
    const totalKR1 = koreanRestaurant.checkout(o1); // total = 1 * ₩4,000
    assert(totalKR1 === 4000, "T5: wrong total for KR1");
    assert(o1.status === "paid", "T5: status not paid");
    assert(kimbap.salesLog.length >= 1, "T5: no sales log entry");

    // 6) (Assertion #6) sales log is shared across restaurants
    //    Place an order in fast food restaurant that includes a SHARED drink.
    const o2 = fastFoodRestaurant.createOrder("FF1");
    o2.addItem("Mineral Water", 2); // MW stock: 20 -> 18 (shared)
    const totalFF1 = fastFoodRestaurant.checkout(o2); // 2 * ₩1,000 = ₩2,000
    assert(totalFF1 === 2000, "T6: wrong total for FF1");

    // The Mineral Water salesLog should reflect BOTH restaurants’ sales.
    const mwLast = mineralWater.salesLog[mineralWater.salesLog.length - 1];
    assert(
        mwLast &&
            mwLast.orderId === "FF1" &&
            mwLast.qty === 2 &&
            mwLast.amount === 2000,
        "T6: shared drink salesLog incorrect"
    );

    console.log("All basic self-tests passed.");
    // Optional: peek logs
    // console.log("Kimbap logs:", kimbap.salesLog);
    // console.log("Mineral Water logs:", mineralWater.salesLog);
})();
