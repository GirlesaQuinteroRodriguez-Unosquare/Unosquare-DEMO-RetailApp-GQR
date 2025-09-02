"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartPage = void 0;
class CartPage {
    page;
    checkoutButton;
    cartItems;
    cartTotal;
    constructor(page) {
        this.page = page;
        this.checkoutButton = page.locator('#checkout-btn');
        this.cartItems = page.locator('#cart-items');
        this.cartTotal = page.locator('#cart-total');
    }
    async proceedToCheckout() {
        await this.checkoutButton.click();
    }
    async getCartTotal() {
        return this.cartTotal.textContent();
    }
}
exports.CartPage = CartPage;
