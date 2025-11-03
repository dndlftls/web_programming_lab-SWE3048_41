function formatPrice(value) {
    return value.toLocaleString("ko-KR") + "원";
}

function updateCartTotals() {
    let grandTotal = 0; // Total Amount Variable

    // TODO: Updating Total Amount
    let items = document.querySelectorAll(".cart-item");

    items.forEach((item) => {
        let PriceEl = item.querySelector(".item-price");
        const price = parseInt(PriceEl.textContent.replace(/[^0-9]/g, ""));
        const qty = parseInt(item.querySelector(".qty-value").textContent);
        let subtotalPriceEl = item.querySelector(".subtotal-value");
        const subtotalPrice = price * qty;
        subtotalPriceEl.textContent = formatPrice(subtotalPrice);

        grandTotal += subtotalPrice;
    });

    const grandTotalEl = document.getElementById("grand-total"); // Total Amount Item in HTML
    grandTotalEl.textContent = formatPrice(grandTotal); // Formatting Text
}

// Increasing Amount of Item
function increaseQty(itemEl) {
    const qtyEl = itemEl.querySelector(".qty-value");
    // TODO : Increasing Amount
    let qty = parseInt(qtyEl.textContent);
    qty += 1;
    qtyEl.textContent = qty;
}

// Decreasing Amount of Item
function decreaseQty(itemEl) {
    const qtyEl = itemEl.querySelector(".qty-value");
    // TODO : Decreasing Amount
    let qty = parseInt(qtyEl.textContent);
    if (qty === 1) return;
    qty -= 1;
    qtyEl.textContent = qty;
}

// EventListeners (When Button clicked) --> implemented
function setupEventListeners() {
    const cart = document.querySelector(".cart-items");

    cart.addEventListener("click", (e) => {
        const target = e.target;

        if (target.classList.contains("btn-increase")) {
            const itemEl = target.closest(".cart-item");
            increaseQty(itemEl);
            updateCartTotals();
        }

        if (target.classList.contains("btn-decrease")) {
            const itemEl = target.closest(".cart-item");
            decreaseQty(itemEl);
            updateCartTotals();
        }
    });
}

// Add Initial EventListeners -> implemented
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    updateCartTotals();
});
